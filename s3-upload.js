require('dotenv').config()
const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3')

const app = express()

// S3 CREDENTIALS
// AWS_ACCESS_KEY_ID
// AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3({apiVersion:'2006-03-01'});
aws.config.loadFromPath('./config.json')
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'banky-test-bucket',
        metadata:(req,file,cb)=>{
            cb(null,{fieldName:file.fieldname});
        },
        key: (req,file,cb) =>{
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        }
    })
})

app.use(express.static('public'))

app.post('/upload',upload.array('avatar'), (req,res)=>{
    return res.json({status:'OK', uploaded:req.files.length})
})