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
        let featured_product = await redis.get("featured_product");
        if(featured_product){
            return res.json(JSON.parse(featured_product));
        }
        //lean return plain js object for good performance
        featured_product = await Product.find({isFeatured:true}).lean();
        if(!featured_product){
            return res.status(404).json({message:"Featured Products not found"});
        }
        await redis.set("featured_products",JSON.stringify(featured_product));
        return res.json(featured_product);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
const createProduct = async(req,res)=>{
    try {
        const{name,description,image,price,isFeatured,category}=req.body;

        let cloudinaryResponse = null;
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image,{folder:"products"});
        }
        const product = new Product({
            name,
            description,
            isFeatured,
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
module.exports = {getAllProducts,getFeaturedProduct,createProduct,deleteProduct,getRecommendedProduct};