'use strict';

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    // The schema of the Upload
    var schema = new mongoose.Schema({
        // Ownership
        application: String,
        team:        String,
        user:        String,
        
        // File informations
        path: String,
        name: String,
        size: Number,
        type: String,
        downloads: {
            type:    Number,
            default: 0
        },
        uploaded: {
            type:    Boolean,
            default: false
        },
        deleted: {
            type:    Boolean,
            default: false
        },
        createdAt: {
            type:    Date,
            default: Date.now
        }
    });

    /**
     * toJSON implementation
     */
    schema.options.toJSON = {
        transform: function(doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;

            switch(ret.type) {

                case 'application/pdf':
                    ret.icon = 'file-pdf-o';
                    break;

                case 'application/zip':
                    ret.icon = 'file-zip-o';
                    break;

                case 'audio/mpeg':
                case 'audio/x-ms-wma':
                case 'audio/vnd.rn-realaudio':
                case 'audio/x-wav':
                    ret.icon = 'file-audio-o';
                    break;

                case 'image/gif':
                case 'image/jpeg':
                case 'image/png':
                case 'image/tiff':
                    ret.icon = 'file-image-o';
                    break;

                case 'video/quicktime':
                case 'video/mpeg':
                case 'video/mp4':
                case 'video/x-msvideo':
                case 'video/x-ms-wmv':
                case 'video/x-flv':
                case 'video/webm':
                    ret.icon = 'file-movie-o';
                    break;

                default:
                    miitoo.logger.error('Undefined icon for mime type:', ret.type);
                    // Default icon
                    ret.icon = 'file-o';
                    break;
            }
            
            delete ret.application;
            delete ret.team;
            delete ret.uploaded;
            delete ret.path;
            return ret;
        }
    };

    // The model of the Upload
    return mongoose.model('Upload', schema);
});

// Register the model
miitoo.register('UploadModel', model);
