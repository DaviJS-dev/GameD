import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private menina!: Phaser.Physics.Matter.Sprite;
  private shiftKey!: Phaser.Input.Keyboard.Key;

  private isTouchingGround = false;

  constructor() {
    super("game");
  }

  init() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.shiftKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SHIFT
      );
    }
  }

  preload() {
    this.load.atlas("menina", "assets/menina.png", "assets/menina.json");

    this.load.image("tiles", "assets/sheet.png");
    this.load.tilemapTiledJSON("tilemap", "assets/game.json");
  }

  create() {
    this.createMeninaAnimations();
    //tilemap
    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage(
      "Tiles",
      "tiles"
    ) as Phaser.Tilemaps.Tileset;

    // collision
    const ground = map.createLayer("ground", tileset);
    if (ground) {
      ground.setCollisionByProperty({ collides: true });
      this.matter.world.convertTilemapLayer(ground);
    }

    // menina
    const { width, height } = this.scale;
    this.matter.add;

    const objectsLayer = map.getObjectLayer("objects");

    objectsLayer!.objects.forEach((objData) => {
      const { x = 0, y = 0, name, width = 0 } = objData;
      switch (name) {
        case "menina-spawn": {
          this.menina = this.matter.add
            .sprite(x + width * 0.5, y, "menina")
            .play("menina-static");

          const widthCollision = 20; // Nova largura do retângulo de colisão
          const heightCollision = 25; // Nova altura do retângulo de colisão
          this.menina.setRectangle(widthCollision, heightCollision);

          const scale = 2; // Fator de escala para diminuir pela metade
          this.menina.setScale(scale);

          this.menina.setFixedRotation();
          this.menina.setOrigin(0.31, 0.58);

          this.menina.setOnCollide((data: MatterJS.ICollisionPair) => {
            this.isTouchingGround = true;
          });

          this.cameras.main.startFollow(this.menina);
          break;
        }
      }
    });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.menina.flipX = true;
      this.menina.displayOriginX = this.menina.width * 0.5;
      this.menina.setVelocityX(-3);
      this.menina.setOrigin(0.7, 0.6);

      if (this.shiftKey.isDown) {
        this.menina.play("menina-run", true);
      } else {
        this.menina.play("menina-walk", true);
      }
    } else if (this.cursors.right.isDown) {
      this.menina.flipX = false;
      this.menina.displayOriginX = 0;
      this.menina.setOrigin(0.31, 0.6);
      this.menina.setVelocityX(3);

      if (this.shiftKey.isDown) {
        this.menina.play("menina-run", true);
      } else {
        this.menina.play("menina-walk", true);
      }
    } else {
      this.menina.setVelocityX(0);
      if (this.isTouchingGround) {
        this.menina.play("menina-static", true);
      }
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    if (spaceJustPressed && this.isTouchingGround) {
      let jumpVelocity = -5;
      this.menina.play("menina-jump", true);  
      if (this.shiftKey.isDown ) {
        jumpVelocity = -8; // Aumentar a altura do pulo quando correndo
      }
      this.menina.setVelocityY(jumpVelocity);
      this.isTouchingGround = false;
      
    }


    if (this.shiftKey.isDown) {
      if (this.cursors.left.isDown) {
        this.menina.setVelocityX(-6);
      } else if (this.cursors.right.isDown) {
        this.menina.setVelocityX(6);
      }
    }
  }

  private createMeninaAnimations() {
    this.anims.create({
      key: "menina-static",
      frameRate: 10,
      frames: this.anims.generateFrameNames("menina", {
        start: 3,
        end: 11,
        prefix: "menina_static",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.anims.create({
      key: "menina-walk",
      frameRate: 10,
      frames: this.anims.generateFrameNames("menina", {
        start: 12,
        end: 19,
        prefix: "menina_walk",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.anims.create({
      key: "menina-run",
      frameRate: 10,
      frames: this.anims.generateFrameNames("menina", {
        start: 20,
        end: 27,
        prefix: "menina_run",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.anims.create({
      key: "menina-jump",
      frameRate: 14 ,
      frames: this.anims.generateFrameNames("menina", {
        start: 89,
        end: 98,
        prefix: "menina_jump",
        suffix: ".png",
      }),
      repeat: 0,
    });
  }
}
