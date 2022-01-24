require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region, 
    accessKeyId,
    secretAccessKey
})

// uploads a file to s3
const uploadFile = file => {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    try {
        return s3.upload(uploadParams).promise()
    } catch(e){
        console.log('Error: ' + ' ' + e)
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
    console.log('deleting avatar stream')

    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    // try {
    //    const res = await s3.deleteObject(deleteParams).promise()
    //    console.log('RES IS THIS')
    //    console.log(res)
    //    console.log(res.status)
    // } catch(e) {
    //     console.log('THERE IS AN ERRRO')
    //     console.log(e)
    // }
    return s3.deleteObject(deleteParams).promise()
}

exports.deleteFileStream = deleteFileStream



