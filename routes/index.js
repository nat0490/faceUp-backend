var express = require('express');
var router = express.Router();

const uniqid = require('uniqid');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


router.post('/upload', async (req, res) => {
    try {
      console.log("in the route");
      
      const photoPath = `./tmp/${uniqid()}.jpg`;
  
      // Vérifier si le fichier a été correctement envoyé
      if (!req.files || !req.files.photoFromFront) {
        console.error('No file uploaded');
        return res.status(400).json({ result: false, error: 'No file uploaded' });
      }
  
      // Déplacer le fichier temporaire
      const resultMove = await req.files.photoFromFront.mv(photoPath);
      if (resultMove) {
        console.error('File move error:', resultMove);
        return res.status(500).json({ result: false, error: resultMove });
      }
  
      // Télécharger le fichier sur Cloudinary
      const resultCloudinary = await cloudinary.uploader.upload(photoPath);
      fs.unlinkSync(photoPath);
  
      res.json({ result: true, url: resultCloudinary.secure_url });
    } catch (error) {
      console.error('Error in /upload route:', error);
      res.status(500).json({ result: false, error: 'Internal server error' });
    }
  });

module.exports = router;
