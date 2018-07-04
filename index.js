/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs    = require('fs'),
    path  = require('path'),
    async = require('@cjssdk/async');


// public
module.exports = {
    unlink: function ( files, log, done ) {
        // convert file list to delete task list and execute
        async.parallel(files.map(function ( file ) {
            // create task
            return function ( ready ) {
                fs.unlink(file, function ( error ) {
                    if ( !error ) {
                        log.info('remove ' + log.colors.bold(file));
                    } else if ( error.code === 'ENOENT' ) {
                        error = null;
                    } else {
                        log.fail(error.toString());
                    }

                    ready(error);
                });
            };
        }), done);
    },

    read: function ( file, log, done ) {
        fs.readFile(file, function ( error, data ) {
            if ( error ) {
                log.fail(error.toString());
            } else {
                log.info(
                    'read %s (size: %s)',
                    log.colors.bold(file),
                    log.colors.green(data.length)
                );
            }

            done(error, data);
        });
    },

    write: function ( files, log, done ) {
        // convert file list to write task list and execute
        async.parallel(files.map(function ( file ) {
            // create task
            return function ( ready ) {
                fs.writeFile(file.name, file.data || '', function ( error ) {
                    if ( error ) {
                        log.fail(error.toString());
                    } else {
                        log.info(
                            'write %s (size: %s)',
                            log.colors.bold(file.name),
                            log.colors.green(fs.statSync(file.name).size)
                        );
                    }

                    ready(error);
                });
            };
        }), done);
    },

    mkdir: function ( targets, log, done ) {
        var paths = [];

        // convert to a list of simple paths for fs.mkdir
        targets.forEach(function ( target ) {
            target = path.normalize(target).split('/');

            target.forEach(function ( dir, index ) {
                dir = target.slice(0, index + 1).join('/');

                // prevent from duplicates
                if ( paths.indexOf(dir) === -1 ) {
                    paths.push(dir);
                }
            });
        });

        // convert paths to mkdir task list and execute
        async.serial(paths.map(function ( dir ) {
            // create task
            return function ( ready ) {
                fs.mkdir(dir, function ( error ) {
                    if ( !error ) {
                        log.info('mkdir ' + log.colors.bold(dir));
                    } else if ( error.code === 'EEXIST' ) {
                        error = null;
                    } else {
                        log.fail(error.toString());
                    }

                    ready(error);
                });
            };
        }), done);
    }
};
