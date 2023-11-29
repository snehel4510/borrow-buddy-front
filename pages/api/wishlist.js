import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";

export default async function handler(req, res) {

    await mongooseConnect();
    
  if (req.method === 'POST') {
    try {
      const { productId, action } = req.body;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Update the inWishlist property based on the user's action
      if (action === 'add') {
        product.inWishlist = true;
      } else if (action === 'remove') {
        product.inWishlist = false;
      }

      // Save the updated product
      await product.save();

      return res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}