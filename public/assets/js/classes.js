

/**
 * after game console is initialized
 * we want charac to drop from the top
 * gravity adds speed to var velocity
 */

/**
 * Create a class to develope game characters
 * we'll use classes since we'll approach project from OOP perspertive
 */
 class Sprite {
    //make constructor
    constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
      this.position = position; //set charac position(x,y);
      this.height = 150;
      this.width = 50;
      this.image = new Image();//native api to create img html element
      this.image.src = imageSrc;//fill in source
      this.scale = scale;//increase image size
      this.framesMax = framesMax,//we use this to loop through img frames
      this.currentFrame = 0;//
      this.framesElapsed = 0;//how many frames we have elapsed throughout the whole animation 
      this.framesHold = 6;//how many frames we hv to go through b4 we change currentFrame
    }
  
    draw() {
        c.drawImage(
            /**
             * set image frames before positions
             */
            this.image, 
            this.currentFrame * (this.image.width / this.framesMax),//x ps of img crop mark
            0,//y ps of img crop mark
            this.image.width / this.framesMax,//crop width
            this.image.height,//crop height
            this.position.x, 
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );//canvas met to draw Img
    }
  
    update() {
      this.draw();
      this.framesElapsed++;//framesElapsed will increase by 1 whenever update func in called
      if(this.framesElapsed % this.framesHold === 0){
        /**
         * if framesElapsed div by framesHold = 0
         * then increase currentFrame
         * we use this to regulate speed of animation
         */
          if(this.currentFrame < this.framesMax -1){
            this.currentFrame++
          }else{
            this.currentFrame = 0
          }
      }
    }
  }
  class Fighter {
    //make constructor
    constructor({ position, velocity, color = "blue", offset }) {
      this.position = position; //set charac position(x,y);
      this.velocity = velocity; //speed
      this.height = 150;
      this.width = 50;
      this.lastKey;
      this.color = color;
      (this.attackBox = {
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        offset: offset,
        width: 100,
        height: 50,
      }),
        this.isAttacking,
        (this.health = 100);
    }
  
    draw() {
      c.fillStyle = this.color; //
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
  
      //attackBox
      if (this.isAttacking) {
        c.fillStyle = "red";
        c.fillRect(
          this.attackBox.position.x,
          this.attackBox.position.y,
          this.attackBox.width,
          this.attackBox.height
        );
      }
    }
  
    update() {
      this.draw();
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
      this.attackBox.position.y = this.position.y;
      this.position.x += this.velocity.x; //how a charac moves on x axis
      this.position.y += this.velocity.y; //how a charac moves on y axis
      if (this.position.y + this.height + this.velocity.y >= canvas.height - 90) {
        this.velocity.y = 0;
        /**
         * this.position.y + this.height will give us height of charac
         * if we add this.velocity.y we charac height and current position
         * we prevent charac from overlooking the scope(height in this instance) of the game board
         */
      } else {
        this.velocity.y += gravity;
      }
    }
  
    attack() {
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 100);
    }
  }