const redis = require("../lib/redis")
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
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


const createProduct = async(req,res)=>{
    try {
        const{name,description,image,price,category}=req.body;
        console.log(name,description,image,price,category);
        
        let cloudinaryResponse = null;
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image,{folder:"products"});
        }
        console.log(cloudinaryResponse);
        
        const product = new Product({
            name,
            description,
            image:cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url :"",
            category,
            price
        });
        await product.save(); 
        console.log("product is saved");
        return res.status(201).json({ success: true, product });

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
module.exports = {getAllProducts,getFeaturedProduct,getProductsByCategory,createProduct,deleteProduct,getRecommendedProduct,toggleIsFeatured};