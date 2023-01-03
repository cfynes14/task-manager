require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.BUCKET_NAME
const region = process.env.BUCKET_REGION
const accessKeyId = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_KEY

const s3 = new S3({
    region, 
    accessKeyId,
    secretAccessKey
})

// uploads a file to s3
const uploadFile = (file, userId) => {
    const uploadParams = {
        Bucket: bucketName,
        Body: file.buffer,
        Key: `${userId}_avatar` 
    }

    try {
        return s3.upload(uploadParams).promise()
    } catch(e){
        console.log('S3 Error: ' + ' ' + e)
    }
}
exports.uploadFile = uploadFile

//downloads a file from s3

const getFileStream = (fileKey) => {

    const downloadParams = {
        Key: fileKey, 
        Bucket: bucketName
    }

   return s3.getObject(downloadParams).createReadStream()
}

exports.getFileStream = getFileStream

const deleteFileStream = async (fileKey) => {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.deleteObject(deleteParams).promise()
}

exports.deleteFileStream = deleteFileStream



