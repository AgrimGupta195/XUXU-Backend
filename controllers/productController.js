const { redis } = require("googleapis/build/src/apis/redis");
const Product = require("../models/productModel");
const cloudinary = require("../lib/cloudinary");
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.json(products);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getFeaturedProduct = async (req, res) => {
    try {
        let featured_products = await redis.get("featured_products");

        if (featured_products) {
            return res.json(JSON.parse(featured_products));
        }

        featured_products = await Product.find({ isFeatured: true }).lean();

        if (!featured_products || featured_products.length === 0) {
            return res.status(404).json({ message: "Featured Products not found" });
        }

        await redis.set("featured_products", JSON.stringify(featured_products), "EX", 3600);

        return res.json(featured_products);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createProduct = async(req,res)=>{
    try {
        const{name,description,image,price,category}=req.body;

        let cloudinaryResponse = null;
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image,{folder:"products"});
        }
        const product = new Product({
            name,
            description,
            image:cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url :"",
            category,
            price
        });

        return res.status(201).json(product);

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
const deleteProduct = async(req,res)=>{
    try {
        const deleted = await Product.findById(req.params.id);
        if(!deleted){
            return res.status(404).json({message:"Product Not Found"});
        }
        if(deleted.image){
              const id = deleted.image.split("/").pop().split(".")[0];
              try {
                await cloudinary.uploader.destroy(`products/${id}`);
                console.log("deleted succesfully");
              } catch (error) {
                return res.status(500).json({ message: "Server error", error: error.message });
              }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.json({message:"Product deleted succesfully"})
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getRecommendedProduct = async(req,res)=>{
    try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,   // 1means include 0 means exlude here
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

const getProductsByCategory = async(req,res)=>{
    const {category} = req.params;
    try {
        const product = await Product.find({category});
        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
const toggleIsFeatured = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured=!product.isFeatured;
            const updateProduct = await product.save();
        await updateFeaturedProductsCache();
        res.json(updateProduct);
        }else{
            return res.status(404).json({message:"Product Not found"})
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function updateFeaturedProductsCache(){
    try {
        const featuredProduct = await Product.find({isFeatured:true}).lean();
        await redis.set("featured_products",JSON.stringify(featuredProduct));
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
module.exports = {getAllProducts,getFeaturedProduct,createProduct,deleteProduct,getRecommendedProduct,toggleIsFeatured};