import Phaser, { Scene } from 'phaser';
import {MapaDani} from './Escenas/mapaDani.js';

var config = {
    type: Phaser.AUTO,
    width: 16 * 30,
    height: 16 * 30,
    scene: [MapaDani],
    scale:{
        mode:Phaser.Scale.FIT,
        autoCenter:Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
};

var game = new Phaser.Game(config);
