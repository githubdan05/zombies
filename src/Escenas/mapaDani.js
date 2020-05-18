import Phaser, { Scene } from 'phaser';

export class MapaDani extends Phaser.Scene {

    constructor() {
        super({ key: "mapa" })
    }

    preload() {
        // Cargamos las imagenes usadas en los Tilesets
        this.load.image('overw', './assets/dani/Overworld.png');
        this.load.image('pistolaDoble', './assets/pistola mágica.png');
        this.load.image('torreta', './assets/torreta.png');
        this.load.image('disparo de torreta', './assets/cannon ball.png');
        this.load.audio('musica','./assets/Recall of the Shadows.mp3')
        this.load.audio('zombieComiendote','./assets/Zombie Sound.wav')
        this.load.audio('vida','./assets/vida.mp3')
        //this.load.audio('correr','./assets/correr.flac')
        this.load.audio('zombieMuerto','./assets/zombieMuerto.wav')
        this.load.audio('disparo','./assets/disparo.mp3')
        this.load.image('rojo', './assets/bullet.png');
        this.load.image('zapatillas', './assets/zapatilla-icono.png');
        this.load.image('municion', './assets/disparos-icono.png');
        this.load.image('vida', './assets/vida-icono.png');
        // Cargamos el JSON del mapa
        this.load.tilemapTiledJSON('mapa', './assets/dani/mapa.json');
        this.load.spritesheet("tronco", "assets/log.png", { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet("minotauro", "assets/minotaur.png", { frameWidth: 48, frameHeight: 48 })
        this.load.spritesheet("soldado", "assets/Axeman Sprite.png", { frameWidth: 35.31, frameHeight: 41.25 })
        this.load.spritesheet("araña", "assets/spider01.png", { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet("bomba", "assets/bombs.png", { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet("explosion", "assets/explosion.png", { frameWidth: 400, frameHeight: 400 })
        this.load.spritesheet('player2', 'assets/character.png',{ frameWidth: 16, frameHeight: 32 })
        this.load.spritesheet('zombie', 'assets/dani.png',{ frameWidth: 16, frameHeight: 32 })
        this.load.spritesheet('mazazoP', 'assets/minotaur(3).png',{ frameWidth: 48, frameHeight: 53 })
    }

    create() {
        this.musicaDeFondo=this.sound.add('musica',{loop:true,volume:0.5})
        this.vidaM=this.sound.add('vida')
        //this.correrM=this.sound.add('correr')
        this.disparoM=this.sound.add('disparo')
        this.zombieMM=this.sound.add('zombieMuerto',{volume:0.4})
        this.zombieMC=this.sound.add('zombieComiendote',{volume:0.7})
        this.musicaDeFondo.play()
        // hacemos el tilemap
        let mapa = this.make.tilemap({ key: 'mapa', tileWidth: 16, tileHeight: 16 });
        var tOver = mapa.addTilesetImage('Overworld', 'overw');
        let capaSuelo = mapa.createStaticLayer('Suelo', tOver, 0, 0);
        let capaArbustos = mapa.createStaticLayer('Arbustos', tOver, 0, 0);
        let capaSetos = mapa.createStaticLayer('setos', tOver, 0, 0);
        this.player2 = this.physics.add.sprite(100, 100, 'player2');
        this.player2.body.setSize(10,10)
        this.player1 = this.physics.add.sprite(150, 100, 'tronco');
        this.player1.body.setSize(10,10)
        this.zombiesM=0
        let velocidadMinotauro=15
        this.golpeMinotauro=false
        this.disparos=this.physics.add.group();
        this.zombies=this.physics.add.group();
        this.arañas=this.physics.add.group();
        this.vidas=this.physics.add.group();
        this.municiones=this.physics.add.group();
        this.soldados=this.physics.add.group();
        this.minotauros=this.physics.add.group();
        this.cañoncetes=this.physics.add.group();
        this.zapatillas=this.physics.add.group();
        this.balasDobles=this.physics.add.group();
        this.vidasZombies=1
        this.contadorTorreta=0
        this.movimiento1=[1,0]
        this.movimiento2=[1,0]
        this.mordisco=false
        this.torreta=null
        this.bomba=null
        this.explosion=null
        this.disparoPV1=1
        this.disparoPV2=1
        this.velocidad1=100
        this.velocidad2=100
        this.vidas1=20
        this.vidas2=20
        this.recuento1=30
        this.recuento2=30
        this.player1balas = this.add.text(16, 16, 'balas1: 30', { fontSize: '12px', fill: '#ffffff' });
        this.player2balas = this.add.text(16,39, 'balas2: 30', { fontSize: '12px', fill: '#ffffff' });
        this.player1vidas = this.add.text(390, 16, 'vidas1: 20', { fontSize: '12px', fill: '#ffffff' });
        this.player2vidas = this.add.text(390,39, 'vidas2: 20', { fontSize: '12px', fill: '#ffffff' });
        this.zombiesMT = this.add.text(200,16, 'zombies muertos: 0', { fontSize: '12px', fill: '#ffffff' });
        this.finDelJuego
        this.torretas=this.physics.add.staticGroup()
        setInterval(()=>{
            let araña=this.arañas.create(50,50,"araña",1,true,true)
            araña.body.setSize(16,16)
            araña.anims.play('downA',true)
            araña.vida=3
        },25000)
        setInterval(()=>{
            let zombie=this.zombies.create(480,Phaser.Math.Between(430,450),"zombie",1,true,true)
            zombie.body.setSize(16,16)
            zombie.vida=Phaser.Math.Between(1,this.vidasZombies)
            //console.log(zombie.vida)
            switch(zombie.vida){
                case 1:
                    zombie.setTint(0xffffff)
                    break;
                case 2:
                    zombie.setTint(0x2ecc71)
                    break;
                case 3:
                    zombie.setTint(0x3498db)
                    break;
                case 4:
                    zombie.setTint(0x8e44ac)
                    break;
                case 5:
                    zombie.setTint(0xff0000)
                    break;
                default:
                    zombie.setTint(0xffffff)
                    break;
            }

        },5000)
        setTimeout(()=>{
            setInterval(()=>{
                //let vida=this.add.image(Phaser.Math.Between(10,470),Phaser.Math.Between(10,470),'vida')
                let vida=this.vidas.create(Phaser.Math.Between(10,470),Phaser.Math.Between(10,470),"vida",1,true,true)
                vida.scale=0.40
            },30000)
        },40000)
        setInterval(()=>{
            //let vida=this.add.image(Phaser.Math.Between(10,470),Phaser.Math.Between(10,470),'vida')
            let zapatilla=this.zapatillas.create(Phaser.Math.Between(10,470),Phaser.Math.Between(10,470),"zapatillas",1,true,true)
            zapatilla.scale=0.40
        },30000)
        setInterval(()=>{
            //let vida=this.add.image(Phaser.Math.Between(10,470),Phaser.Math.Between(10,470),'vida')
            let balaDoble=this.balasDobles.create(Phaser.Math.Between(10,470),Phaser.Math.Between(10,470),"pistolaDoble",1,true,true)
            balaDoble.scale=0.04
        },50000)
        setTimeout(()=>{
            setInterval(()=>{
                //let vida=this.add.image(Phaser.Math.Between(10,470),Phaser.Math.Between(10,470),'vida')
                let municion=this.municiones.create(Phaser.Math.Between(10,470),Phaser.Math.Between(10,470),"municion",1,true,true)
                municion.scale=0.40
            },30000)
        },20000)
        this.physics.add.overlap(this.player1,this.vidas,(p,v)=>{
            this.vidas1=this.vidas1+5
            v.destroy()
            this.player1vidas.setText('vidas1= '+this.vidas1)
            this.vidaM.play()
        },null,this)
        this.physics.add.overlap(this.player2,this.vidas,(p,v)=>{
            this.vidas2=this.vidas2+5
            v.destroy()
            this.player2vidas.setText('vidas2= '+this.vidas2)
            this.vidaM.play()
        },null,this)
        this.physics.add.overlap(this.player1,this.municiones,(p,m)=>{
            this.recuento1=this.recuento1+10
            m.destroy()
            this.player1balas.setText('balas1= '+this.recuento1)
        },null,this)
        this.physics.add.overlap(this.player2,this.municiones,(p,m)=>{
            this.recuento2=this.recuento2+10
            m.destroy()
            this.player2balas.setText('balas2= '+this.recuento2)
        },null,this)
        this.physics.add.overlap(this.player1,this.balasDobles,(p,b)=>{
            b.destroy()
            const rafaga=(numeroBalas)=> {
                setTimeout(()=>{
                    let disparo1 = this.disparos.create(this.player1.x,this.player1.y, 'rojo');
                    disparo1.setCollideWorldBounds(true)
                    disparo1.scale=0.75
                    disparo1.setCircle(5,5,5)
                    disparo1.setBounce(1)
                    let velocidadDisparoX1=this.movimiento1[1]*200
                    let velocidadDisparoY1=this.movimiento1[0]*200
                    disparo1.setVelocity(velocidadDisparoX1,velocidadDisparoY1)
                    //console.log(numeroBalas)
                    //this.balasPV1=this.balasPV1+1
                    if(numeroBalas>0){
                        rafaga(numeroBalas-1)
                    }
                },400)
                
            }
            rafaga(10)
            
        },null,this)
        this.physics.add.overlap(this.player2,this.balasDobles,(p,b)=>{
            b.destroy()
            const rafaga=(numeroBalas)=> {
                setTimeout(()=>{
                    let disparo1 = this.disparos.create(this.player2.x,this.player2.y, 'rojo');
                    disparo1.setCollideWorldBounds(true)
                    disparo1.scale=0.75
                    disparo1.setCircle(5,5,5)
                    disparo1.setBounce(1)
                    let velocidadDisparoX2=this.movimiento2[1]*200
                    let velocidadDisparoY2=this.movimiento2[0]*200
                    disparo1.setVelocity(velocidadDisparoX2,velocidadDisparoY2)
                    console.log(numeroBalas)
                    //this.balasPV1=this.balasPV1+1
                    if(numeroBalas>0){
                        rafaga(numeroBalas-1)          
                    }
                },400)
                
            }
            console.log("pasa por aqui")
            rafaga(10)
            
        },null,this)
        this.physics.add.overlap(this.player1,this.zapatillas,(p,z)=>{
            //this.correrM.play()
            this.velocidad1=this.velocidad1+20
            z.destroy()
            this.player1.setTint(0xff0000)
            setTimeout(()=>{
                this.velocidad1=this.velocidad1-20
                if(this.velocidad1==100)this.player1.setTint(0xffffff)
            },5000)
        },null,this)
        this.physics.add.overlap(this.player2,this.zapatillas,(p,z)=>{
            //this.correrM.play()
            this.velocidad2=this.velocidad2+20
            z.destroy()
            this.player2.setTint(0xff0000)
            setTimeout(()=>{
                this.velocidad2=this.velocidad2-20
                if(this.velocidad2==100)this.player2.setTint(0xffffff)
            },5000)
        },null,this)
        this.physics.add.collider(this.zombies,this.zombies)
        this.physics.add.collider(this.zombies,this.player1,(zombies,player1)=>{
            this.zombieMC.play()
            this.vidas1=this.vidas1-1
            this.player1vidas.setText('vidas1= '+this.vidas1)
            console.log(this.vidas1)
            this.mordisco=true
            setTimeout(()=>{
                this.mordisco=false
            },1000)
            if(this.vidas1==0){
                this.physics.pause()
                this.add.text(100, 150, 'TE HAN COMIDO\n LOS ZOMBIES', { fontSize: '40px', fill: '#000000',backgroundColor:'#ffffff' });
            }
        })
        this.physics.add.collider(this.arañas,this.player1,(araña,player1)=>{
            this.vidas1=this.vidas1-1
            this.player1vidas.setText('vidas1= '+this.vidas1)
            console.log(this.vidas1)
            this.mordiscoAraña=true
            setTimeout(()=>{
                this.mordiscoAraña=false
            },1000)
            if(this.vidas1==0){
                this.physics.pause()
                this.add.text(100, 150, 'TE HAN COMIDO\n LOS ZOMBIES', { fontSize: '40px', fill: '#000000',backgroundColor:'#ffffff' });
            }
        })
        this.physics.add.collider(this.zombies,this.player2,(zombies,player2)=>{
            this.zombieMC.play()
            this.vidas2=this.vidas2-1
            this.player2vidas.setText('vidas2= '+this.vidas2)
            console.log(this.vidas2)
            this.mordisco=true
            setTimeout(()=>{
                this.mordisco=false
            },1000)
            if(this.vidas2==0){
                this.physics.pause()
                this.add.text(100, 150, 'TE HAN COMIDO\n LOS ZOMBIES', { fontSize: '40px', fill: '#000000',backgroundColor:'#ffffff'});
            }
            if(this.vidas2<=5){
                setInterval(()=>{
                    let soldado=this.soldados.create(this.player2.x,this.player.y,"soldado",1,true,true)
                    soldado.body.setSize(16,16)
                    soldado.anims.play('soldado',true)
                    soldado.vida=3
                },1000)
            }
        })
        this.physics.add.collider(this.arañas,this.player2,(araña,player2)=>{
            this.vidas2=this.vidas2-1
            this.player2vidas.setText('vidas2= '+this.vidas2)
            console.log(this.vidas2)
            this.mordiscoAraña=true
            setTimeout(()=>{
                this.mordiscoAraña=false
            },1000)
            if(this.vidas2==0){
                this.physics.pause()
                this.add.text(100, 150, 'TE HAN COMIDO\n LOS ZOMBIES', { fontSize: '40px', fill: '#000000',backgroundColor:'#ffffff'});
            }
        })
        
        this.physics.add.collider(this.minotauros,this.player2,(minotauro,player2)=>{
            this.vidas2=this.vidas2-1
            this.player2vidas.setText('vidas2= '+this.vidas2)
            this.golpeMinotauro=true
            if(minotauro,player2){
                this.Gminotauro=this.physics.add.sprite(minotauro.x,minotauro.y,'mazazo',0).setScale(1.5)
                this.Gminotauro.anims.play('mazazo',true)
            }
            
            if(this.vidas2==0){
                this.physics.pause()
                this.add.text(100, 150, 'TE HAN COMIDO\n LOS ZOMBIES', { fontSize: '40px', fill: '#000000',backgroundColor:'#ffffff'});
            }
        })
        this.physics.add.collider(this.minotauros,this.player1,(minotauro,player1)=>{
            this.vidas1=this.vidas1-1
            this.player1vidas.setText('vidas1= '+this.vidas1)
            this.golpeMinotauro=true
            if(minotauro,player1){
                //his.Gminotauro=this.physics.add.sprite(minotauro.x,minotauro.y,'mazazoP',0).setScale(1.5)
                minotauro.anims.play('mazazo',true)
            }
            
            if(this.vidas1==0){
                this.physics.pause()
                this.add.text(100, 150, 'TE HAN COMIDO\n LOS ZOMBIES', { fontSize: '40px', fill: '#000000',backgroundColor:'#ffffff'});
            }
        })
        this.physics.add.collider(this.arañas,this.zombies)
        this.physics.add.collider(this.zombies,this.minotauros)
        this.physics.add.collider(this.arañas,this.minotauros)
        this.physics.add.collider(this.player1,this.player2)
        this.physics.add.collider(capaArbustos,this.player1)
        this.physics.add.collider(capaArbustos,this.player2)
        this.physics.add.collider(capaArbustos,this.zombies)
        this.physics.add.collider(capaArbustos,this.arañas)
        this.physics.add.collider(capaArbustos,this.minotauros)
        this.physics.add.collider(capaSetos,this.player1)
        this.physics.add.collider(capaSetos,this.player2)
        this.physics.add.collider(capaSetos,this.zombies)
        this.physics.add.collider(this.disparos,this.minotauros,(disparo,minotauro)=>{
            disparo.destroy(true)
            if(minotauro.vida==1){
                minotauro.destroy(true)
                this.zombiesM=this.zombiesM+1
                this.zombiesMT.setText('zombies muertos: '+this.zombiesM)
            }else{
                minotauro.vida=minotauro.vida-1
            }
        })
        this.physics.add.collider(this.disparos,this.arañas,(disparo,araña)=>{
            disparo.destroy(true)
            if(araña.vida==1){
                araña.destroy(true)
                this.zombiesM=this.zombiesM+1
                this.zombiesMT.setText('zombies muertos: '+this.zombiesM)
            }else{
                araña.vida=araña.vida-1
            }
        })
        this.physics.add.collider(this.disparos,this.zombies,(disparo,zombie)=>{
            disparo.destroy(true)
            this.zombieMM.play()
            if(zombie.vida==1){
                zombie.destroy(true)
                this.zombiesM=this.zombiesM+1
                this.zombiesMT.setText('zombies muertos: '+this.zombiesM)
            }else{
                zombie.vida=zombie.vida-1
            }
            if(this.zombiesM%5==0 && this.vidasZombies!=5){
                this.vidasZombies=this.vidasZombies+1
            }
            if(this.zombiesM%1==0){
                let minotauro=this.minotauros.create(480,Phaser.Math.Between(430,450),"mazazoP",1,true,true)
                minotauro.body.setSize(16,16)
                minotauro.scale=1.50
                minotauro.vida=7
            }
        })
        this.physics.add.collider(this.disparos,capaSetos,(disparo,setos)=>{
            this.zombieMM.play()
            disparo.destroy(true)
        })
        capaArbustos.setCollisionByProperty({collides:true})
        capaSetos.setCollisionByProperty({collides:true})
        this.player1.setCollideWorldBounds(true);
        this.anims.create({
            key: 'soldado',
            frames: this.anims.generateFrameNumbers('soldado', { start: 0, end: 29 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'mazazo',
            frames: this.anims.generateFrameNumbers('minotaur(3)', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 15 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('tronco', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('tronco', { start: 6, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('tronco', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('tronco', { start: 18, end: 21 }),
            frameRate: 10,
            repeat: -1
        });


        this.anims.create({
            key: 'stop',
            frames: [{ key: 'tronco', frame: 1 }],
            frameRate: 20
        });
        this.player2.setCollideWorldBounds(true);

        this.anims.create({
            key: 'downp2',
            frames: this.anims.generateFrameNumbers('player2', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'upp2',
            frames: this.anims.generateFrameNumbers('player2', { start: 34, end: 37 }),
            frameRate: 10,
            repeat: -1
        });this.anims.create({
            key: 'leftp2',
            frames: this.anims.generateFrameNumbers('player2', { start: 51, end: 54 }),
            frameRate: 10,
            repeat: -1
        });this.anims.create({
            key: 'rightp2',
            frames: this.anims.generateFrameNumbers('player2', { start: 17, end: 20 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'stopp2',
            frames: [{ key: 'player2', frame: 0 }],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'downA',
            frames: this.anims.generateFrameNumbers('araña', { start: 20, end: 29 }),
            frameRate: 10,
            repeat: -1
        });
        this.keyEnter=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
        this.keySpace=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey('W');
        this.keyP = this.input.keyboard.addKey('P');
        this.keyA = this.input.keyboard.addKey('A');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyD = this.input.keyboard.addKey('D');
        this.keyQ = this.input.keyboard.addKey('Q');
        this.keyZ = this.input.keyboard.addKey('Z');

        this.add.text(200, 30, 'Dani´s Village', { fontFamily: '"Roboto Condensed"', fontSize: 30 });
    }
    calculaDireccion(Ax,Ay,Bx,By){
        let auxX=Bx-Ax
        let auxY=By-Ay
        let distancia=Math.sqrt(auxX*auxX+auxY*auxY)
        return[auxX/distancia,auxY/distancia]
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
            if(this.torreta==null){
                
                this.torreta =this.physics.add.staticImage(this.player2.x,this.player2.y,'torreta',0).setSize(32,32).setScale(0.5)
                this.torreta.vida=5
                this.physics.add.collider(this.arañas,this.torreta,(araña,torreta)=>{
                    this.torreta.vida=this.torreta.vida-1
                    console.log(this.torreta.vida)
                    this.mordiscoAraña=true
                    setTimeout(()=>{
                        this.mordiscoAraña=false
                    },1000)
                    if(this.torreta.vida==0){
                       this.torreta.destroy()
                       this.torreta=null
                       console.log('e')
                    }
                })
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyP)){
            if(this.bomba==null){
                this.bomba=this.physics.add.sprite(this.player1.x,this.player1.y,'bomba',0)
            }else{
                this.explosion=this.physics.add.sprite(this.bomba.x,this.bomba.y,'explosion',0).setScale(0.3)
                this.bomba.destroy()
                this.bomba=null
                this.explosion.anims.play('explosion',true)
                this.zombies.children.iterate((zombie)=>{
                    if(zombie){
                        let distanciaZombie=Phaser.Math.Distance.Between(zombie.x,zombie.y,this.explosion.x,this.explosion.y)
                        if(distanciaZombie<=200){
                            zombie.destroy()
                        }
                    }
                   
                })
                this.explosion.on('animationcomplete',()=>{
                    this.explosion.destroy()
                })
                
            }
        }
        if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {

            if (this.cursors.left.isDown) {
                this.player1.setVelocityX(-this.velocidad1);
                this.movimiento1[1]=-1
                this.player1.anims.play('left', true);
            }
            else if (this.cursors.right.isDown) {
                this.player1.setVelocityX(this.velocidad1);
                this.movimiento1[1]=1
                this.player1.anims.play('right', true);
            }else{
                this.movimiento1[1]=0
            }
             if (this.cursors.up.isDown) {
                this.player1.setVelocityY(-this.velocidad1);
                this.movimiento1[0]=-1
                this.player1.anims.play('up', true);
            }
            else if (this.cursors.down.isDown) {
                this.player1.setVelocityY(this.velocidad1);
                this.movimiento1[0]=1
                this.player1.anims.play('down', true);
                

            }else{
                this.movimiento1[0]=0
            }
            
        }
        else {
            this.player1.setVelocityX(0);
            this.player1.setVelocityY(0);
            this.player1.anims.play('stop', true);
        }
        if (this.keyW.isDown || this.keyA.isDown || this.keyS.isDown || this.keyD.isDown) {
            if (this.keyA.isDown) {
                this.player2.setVelocityX(-this.velocidad2);
                this.movimiento2[1]=-1
                this.player2.anims.play('leftp2', true);
            }
            else if (this.keyD.isDown) {
                this.player2.setVelocityX(this.velocidad2);
                this.movimiento2[1]=1
                this.player2.anims.play('rightp2', true);

            }else{
                this.movimiento2[1]=0
            }
             if (this.keyW.isDown) {
                this.player2.setVelocityY(-this.velocidad2);
                this.movimiento2[0]=-1
                this.player2.anims.play('upp2', true);

            }
            else if (this.keyS.isDown) {
                this.player2.setVelocityY(this.velocidad2);
                this.movimiento2[0]=1
                this.player2.anims.play('downp2', true);
            }else{
                this.movimiento2[0]=0
            }
            

        }
        else {
            this.player2.setVelocityX(0);
            this.player2.setVelocityY(0);
            this.player2.anims.play('stopp2', true);
        }
        this.minotauros.children.iterate((minotauro)=>{
            let distanciaplayer1m=Phaser.Math.Distance.Between(this.player1.x,this.player1.y,minotauro.x,minotauro.y)
            let distanciaplayer2m=Phaser.Math.Distance.Between(this.player2.x,this.player2.y,minotauro.x,minotauro.y)
            if(this.golpeMinotauro==true){
                this.physics.moveToObject(minotauro,this.player1,0) 
            }
            let velocidadMinotauro=15
            if (distanciaplayer1m<distanciaplayer2m){
                this.physics.moveToObject(minotauro,this.player1,velocidadMinotauro) 
            }
            else{
                this.physics.moveToObject(minotauro,this.player2,velocidadMinotauro)
            }
        })
        this.arañas.children.iterate((araña)=>{
            let distanciaplayer1a=Phaser.Math.Distance.Between(this.player1.x,this.player1.y,araña.x,araña.y)
            let distanciaplayer2a=Phaser.Math.Distance.Between(this.player2.x,this.player2.y,araña.x,araña.y)
            if(this.mordiscoAraña==true){
                this.physics.moveToObject(araña,this.player1,0) 
            }else{
                let velocidadAraña=15
                if(this.torreta!=null){
                    this.physics.moveToObject(araña,this.torreta,velocidadAraña)
                }else{
                    if (distanciaplayer1a<distanciaplayer2a){
                        this.physics.moveToObject(araña,this.player1,velocidadAraña) 
                    }
                    else{
                        this.physics.moveToObject(araña,this.player2,velocidadAraña)
                    }
                }
            }           
        })        
        this.zombies.children.iterate((zombie)=>{
            let distanciaplayer1=Phaser.Math.Distance.Between(this.player1.x,this.player1.y,zombie.x,zombie.y)
            let distanciaplayer2=Phaser.Math.Distance.Between(this.player2.x,this.player2.y,zombie.x,zombie.y)
            if(this.torreta!=null){
                let distanciatorreta=Phaser.Math.Distance.Between(this.torreta.x,this.torreta.y,zombie.x,zombie.y)
                if(distanciatorreta<=150){
                    this.contadorTorreta+=1 
                    let radianesTorreta=Phaser.Math.Angle.Between(this.torreta.x,this.torreta.y,zombie.x,zombie.y)
                    let gradosTorreta=Phaser.Math.RadToDeg(radianesTorreta)-90;
                    this.torreta.setAngle(gradosTorreta)
                    if(this.contadorTorreta==180) {
                        let disparoTorreta = this.disparos.create(this.torreta.x,this.torreta.y,'rojo');
                        disparoTorreta.setCollideWorldBounds(true)
                        disparoTorreta.scale=0.75
                        disparoTorreta.setCircle(5,5,5)
                        disparoTorreta.setBounce(1)
                        let direccion=this.calculaDireccion(this.torreta.x,this.torreta.y,zombie.x,zombie.y)
                        disparoTorreta.setVelocity(direccion[0]*300,direccion[1]*300)
                        this.contadorTorreta=0
                    }   
                }
            }
            if(this.mordisco==true){
                this.physics.moveToObject(zombie,this.player1,0) 
            }else{
                let velocidadZombie=50
                switch(zombie.vida){
                    case 2:
                        velocidadZombie=40
                        break;
                    case 3:
                        velocidadZombie=30
                        break;
                    case 4:
                        velocidadZombie=20
                        break;
                    case 5:
                        velocidadZombie=10
                        break;
                    default:
                        velocidadZombie=50
                        break;
                }
                if (distanciaplayer1<distanciaplayer2){
                    this.physics.moveToObject(zombie,this.player1,velocidadZombie) 
                }
                else{
                    this.physics.moveToObject(zombie,this.player2,velocidadZombie)
                }
            }           

        })
        if (Phaser.Input.Keyboard.JustDown(this.keyEnter)){
            if(this.recuento1>0){
                this.disparoM.play()
                let disparo = this.disparos.create(this.player1.x,this.player1.y, 'rojo');
                disparo.setCollideWorldBounds(true)
                disparo.scale=0.75
                disparo.setCircle(5,5,5)
                disparo.setBounce(1)
                let velocidadDisparoX=this.movimiento1[1]*200
                let velocidadDisparoY=this.movimiento1[0]*200
                disparo.setVelocity(velocidadDisparoX,velocidadDisparoY)
                this.recuento1=this.recuento1-1
                this.player1balas.setText('balas1= '+this.recuento1)
                //this.disparos.add(disparo)
                console.log(this.movimiento1)
            
                                
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.keySpace)){
            if(this.recuento2>0){
                this.disparoM.play()
                let disparo = this.disparos.create(this.player2.x,this.player2.y, 'rojo');
                disparo.setCollideWorldBounds(true)
                disparo.scale=0.75
                disparo.setCircle(5,5,5)
                disparo.setBounce(1)
                let velocidadDisparoX=this.movimiento2[1]*200
                let velocidadDisparoY=this.movimiento2[0]*200
                disparo.setVelocity(velocidadDisparoX,velocidadDisparoY)
                this.recuento2=this.recuento2-1
                this.player2balas.setText('balas2= '+this.recuento2)
            }
            //this.disparos.add(disparo
        
        }
        //if(this.zombies,this.player1){
            //let vidas1=10;
            //vidas1=vidas1-1;
            //this.player1vidas.setText('vidas1= '+this.vidas1)
        //}
        //if(this.zombies,this.player2){
            //let vidas2=10;
            //vidas2=vidas2-1;
            //this.player2vidas.setText('vidas1= '+this.vidas2)
        //}

    }




}
