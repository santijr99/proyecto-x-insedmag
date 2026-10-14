let modo = 1
let estado = 0
let bola = 2
let golA = 0
let golB = 0
let texto = ""
let esVerdadera = true
let activa = false
let primero = 0
let nuevoPartido = false

function generarPregunta() {
    let a = 0
    let b = 0
    let r = 0
    let op = ""
    if (modo == 1) {
        a = randint(5, 40)
        b = randint(2, 25)
        if (randint(0, 1) == 0) {
            r = a + b
            op = "+"
        } else {
            if (b > a) {
                let aux = a
                a = b
                b = aux
            }
            r = a - b
            op = "-"
        }
    } else {
        a = randint(2, 12)
        b = randint(2, 12)
        r = a * b
        op = "x"
    }
    esVerdadera = randint(0, 99) < 60
    if (!esVerdadera) {
        let d = 1
        let sorteo = randint(0, 3)
        if (sorteo == 1) {
            d = 2
        } else if (sorteo == 2) {
            d = 10
        } else if (sorteo == 3) {
            if (modo == 2) {
                d = a
            } else {
                d = 1
            }
        }
        if (randint(0, 1) == 0) {
            d = 0 - d
        }
        if (r + d < 0) {
            d = 0 - d
        }
        r = r + d
    }
    texto = "" + a + op + b + "=" + r
}

function dibujarCancha() {
    basic.clearScreen()
    for (let y = 1; y <= 3; y++) {
        led.plotBrightness(0, y, 60)
        led.plotBrightness(4, y, 60)
    }
    led.plot(bola, 2)
}

function celebrarGol() {
    music.playTone(Note.C5, music.beat(BeatFraction.Quarter))
    music.playTone(Note.E5, music.beat(BeatFraction.Quarter))
    music.playTone(Note.G5, music.beat(BeatFraction.Half))
    basic.showString("GOL " + golA + "-" + golB, 200)
    bola = 2
}

function jugarRonda() {
    generarPregunta()
    primero = 0
    activa = true
    basic.showString(texto, 300)
    let t = 0
    while (primero == 0 && t < 4000) {
        basic.pause(50)
        t += 50
    }
    activa = false

    if (primero != 0) {
        let haciaDerecha = (esVerdadera && primero == 1) || (!esVerdadera && primero == 2)
        if (esVerdadera) {
            basic.showIcon(IconNames.Yes)
        } else {
            basic.showIcon(IconNames.No)
        }
        basic.pause(1000)
        if (haciaDerecha) {
            bola += 1
        } else {
            bola -= 1
        }
    }

    dibujarCancha()
    basic.pause(1500)

    if (bola >= 4) {
        golA += 1
        celebrarGol()
    } else if (bola <= 0) {
        golB += 1
        celebrarGol()
    }

    if (golA >= 3 || golB >= 3) {
        if (golA > golB) {
            basic.showString("GANA A!", 200)
        } else {
            basic.showString("GANA B!", 200)
        }
        estado = 2
    } else {
        dibujarCancha()
        basic.pause(1500)
    }
}

input.onButtonPressed(Button.A, function () {
    if (estado == 0) {
        modo = 1
        nuevoPartido = true
        estado = 1
    } else if (estado == 1 && activa && primero == 0) {
        primero = 1
    }
})

input.onButtonPressed(Button.B, function () {
    if (estado == 0) {
        modo = 2
        nuevoPartido = true
        estado = 1
    } else if (estado == 1 && activa && primero == 0) {
        primero = 2
    }
})

input.onButtonPressed(Button.AB, function () {
    if (estado == 2) {
        estado = 0
    }
})

basic.forever(function () {
    if (estado == 0) {
        basic.showString("A:+- B:x", 100)
    } else if (estado == 1) {
        if (nuevoPartido) {
            golA = 0
            golB = 0
            bola = 2
            nuevoPartido = false
            basic.showString("YA!", 150)
            dibujarCancha()
            basic.pause(1500)
        }
        jugarRonda()
    } else {
        basic.showString("A+B", 150)
        basic.pause(1000)
    }
})
