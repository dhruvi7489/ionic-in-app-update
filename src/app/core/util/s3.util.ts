import { S3Object } from "../modal/s3-object.modal";

export class S3Util {

    public static getFileUrl(s3Object: S3Object) {
        return 'https://' + s3Object.bucket + '.s3.' + s3Object.region + '.amazonaws.com/' + s3Object.key;
    }

}