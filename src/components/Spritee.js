// Sprite.js
export class Sprite {
    constructor(x, y, largura, altura) {
      this.x = x;
      this.y = y;
      this.largura = largura;
      this.altura = altura;
    }
  
    print(context, img, xCanvas, yCanvas) {
      context.drawImage(
        img,
        this.x,
        this.y,
        this.largura,
        this.altura,
        xCanvas,
        yCanvas,
        this.largura,
        this.altura
      );
    }
  }
  