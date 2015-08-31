
miitoo.once('after:start', function() {
    var primus = miitoo.get('Primus');

    primus.save(__dirname + '/../public/dist/js/primus.js', function save(err) {
        if(err) {
            miitoo.logger.error(err.message);
            miitoo.logger.error(err.stack);
        } else {
            miitoo.logger.info('Primus script generated:', '/public/dist/js/primus.js');
        }
    });
});