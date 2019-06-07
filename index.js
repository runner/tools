/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

const
    fs    = require('fs'),
    path  = require('path'),
    async = require('cjs-async');


function unlink ( files, log, done ) {
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
}


function read ( file, log, done ) {
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
}


function write ( files, log, done ) {
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
}


function mkdir ( targets, log, done ) {
    const paths = [];

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


function copy ( config, log, done ) {
    let level       = 0,
        directories = 0,
        files       = 0;

    function finish ( error, callback ) {
        if ( error ) {
            log.fail(error.toString());
        } else {
            log.info(
                'copy %s to %s (directories: %s, files: %s)',
                log.colors.bold(config.source),
                log.colors.bold(config.target),
                log.colors.bold(directories),
                log.colors.bold(files)
            );
        }

        callback(error);
    }

    function process ( source, target, callback ) {
        level++;

        fs.mkdir(target, function ( error ) {
            if ( error && error.code !== 'EEXIST' ) {
                finish(error, callback);
            } else {
                if ( !error ) {
                    directories++;
                }

                fs.readdir(source, function ( error, list ) {
                    // check exist source
                    if ( error ) {
                        finish(error, callback);
                    } else if ( list.length ) {
                        // handle every list item by its type
                        list.forEach(function ( item ) {
                            const
                                sourceItem = path.join(source, item),
                                targetItem = path.join(target, item),
                                sourceStat = fs.statSync(sourceItem);

                            if ( sourceStat.isDirectory() ) {
                                // call copy using new sources
                                process(sourceItem, targetItem, callback);
                            } else if ( !fs.existsSync(targetItem) || sourceStat.mtime > fs.statSync(targetItem).mtime ) {
                                fs.writeFileSync(targetItem, fs.readFileSync(sourceItem));
                                files++;
                            }
                        });

                        level--;

                        if ( level === 0 ) {
                            finish(null, callback);
                        }
                    }
                });
            }
        });
    }

    fs.exists(config.source, function ( exists ) {
        if ( exists ) {
            process(config.source, config.target, done);
        } else {
            finish(config.source + 'doesn\'t exists');
        }
    });
}


// public
module.exports = {
    unlink,
    read,
    write,
    mkdir,
    copy
};
