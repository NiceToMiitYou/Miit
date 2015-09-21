'use strict';

var bcrypt = require('bcrypt');
var crypto = require('crypto');

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    var ObjectId = mongoose.Schema.Types.ObjectId;

    function md5(input) {
        // Create ShaSum
        var shasum = crypto.createHash('md5');

        // Add the content of shasum
        shasum.update(input);

        // Return the value
        return shasum.digest('hex');
    }

    // The schema of the User
    var schema = new mongoose.Schema({
        email: {
            type:   String,
            unique: true
        },
        name:     String,
        password: String,
        avatar:   String,
        teams:    [{
            type: ObjectId,
            ref: 'Team'
        }]
    });

    schema.pre('save', function (next) {
        // Generate the default name using the email
        if(!this.name && this.email) {
            this.name = this.email.split('@', 1)[0];
        }

        if(this.isNew || !this.avatar || this.isModified('email')) {
            this.email  = this.email.toLowerCase();
            this.avatar = md5(this.email);
        }

        // Generate the new password
        if(this.isNew || this.isModified('password')) {
            var user = this;

            bcrypt.genSalt( 10, function( err, salt ) {
                bcrypt.hash( user.password, salt, function( err, hash ) {
                    if ( err )
                    {
                        return next( err );
                    }
                    user.password = hash;
                    next();
                } );
            } );
        }
        else
        {
            next();
        }
    });

    // Validate the login
    schema.methods.validPassword = function (password, cb) {
        bcrypt.compare( password, this.password, function( err, res ) {
            if ( err )
            {
                return cb( false );
            }

            return cb( res );
        } );
    };

    /**
     * toJSON implementation
     */
    schema.options.toJSON = {
        transform: function(doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.email;
            delete ret.password;
            delete ret.teams;
            return ret;
        }
    };

    // The model of the User
    return mongoose.model('User', schema);
});

// Register the model
miitoo.register('UserModel', model);