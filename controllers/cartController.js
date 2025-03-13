const Product = require("../models/productModel");
const getCartProducts = async (req, res) => {
    try {
        const user = req.user;
        const products = await Product.find({ _id: { $in: user.cartItems.map(item => item.id) } });

        const cartItems = products.map(product => {
            const item = user.cartItems.find(item => item.id === product._id.toString());
            return { ...product.toJSON(), quantity: item.quantity };
        });
        return res.status(200).json(cartItems);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


const addToCart = async(req,res)=>{
    try{
        const {id} = req.body;
        const user = req.user;
        const existingItem  = user.cartItems.find(item => item.id === id);
        if(existingItem){
            existingItem.quantity += 1;
        }else{
            user.cartItems.push({id,quantity:1});
        }
        await user.save();
        return res.status(201).json({message:"Product added to cart"});
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
const removeAllfromCart = async(req,res)=>{
        try {
            const { productId } = req.body;
            const user = req.user;
            if (!productId) {
                user.cartItems = [];
            } else {
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
            }
            await user.save();
            res.json(user.cartItems);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
}
const updateCartQuantity = async(req,res)=>{
    try {
        try{
            const {id} = req.params;
            const quantity = req.body;
            const user = req.user;
            const existingItem  = user.cartItems.find(item => item.id === id);
            if(existingItem){
                if(quantity === 0){
                    user.cartItems = user.cartItems.filter(item => item.id !== id);
                    await user.save();
                }else{
                    existingItem.quantity = quantity;
                    await user.save();
                }
                return res.status(201).json(user.cartItems);
            }else{
                return res.status(404).json({message:"Product not found in cart"});
            }
        }catch(error){
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    } catch (error) {
        
    }
}

module.exports = {addToCart,removeAllfromCart,updateCartQuantity,getCartProducts};