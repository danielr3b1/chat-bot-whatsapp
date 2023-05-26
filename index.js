const path = require('path');
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const WsProvider  = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const PORT = process.env.PORT || 3000

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

const flowPDFProductos = addKeyword('1').addAnswer('Este mensaje envia una imagen', {
    media: 'https://hostnation.store/pdf/catalogos_producto.pdf',
}).addAnswer(
    [
        "Te envie el catalogo de ferreteria en PDF ☝\n*Elige otras opciones:*",
        "2️⃣ Catalogos casas",
        "3️⃣ Catalogos bloquetas",
        "4️⃣ Metodos de pago",
        "5️⃣ Consultar con un *asesor*"
    ],
    {
        capture: true
    },
    (ctx, flow) => {
        if (ctx.body === '2') {
            flow.gotoFlow(flowPDFCasas)
        } else if (ctx.body === '3') {
            flow.gotoFlow(flowPDFBloquetas)
        } else if (ctx.body === '4') {
            flow.gotoFlow(flowMetodoPagos)
        } else if (ctx.body === '5') {
            flow.gotoFlow(flowAsesor)
        }
    }
)

const flowPDFCasas = addKeyword('2').addAnswer('Este mensaje envia una imagen', {
    media: 'https://hostnation.store/pdf/catalogos_casas.pdf',
}).addAnswer(
    [
        "Te envie el catalogo de casas en PDF ☝\n*Elige otras opciones:*",
        "1️⃣ Catalogos ferreteria",
        "3️⃣ Catalogos bloquetas",
        "4️⃣ Metodos de pago",
        "5️⃣ Consultar con un *asesor*"
    ],
    {
        capture: true
    },
    (ctx, flow) => {
        if (ctx.body === '1') {
            flow.gotoFlow(flowPDFProductos)
        } else if (ctx.body === '3') {
            flow.gotoFlow(flowPDFBloquetas)
        } else if (ctx.body === '4') {
            flow.gotoFlow(flowMetodoPagos)
        } else if (ctx.body === '5') {
            flow.gotoFlow(flowAsesor)
        }
    }
)

const flowPDFBloquetas = addKeyword('3').addAnswer(
    [
        "Bloquetas no disponible por el momento. ☝\n*Elige otras opciones:*",
        "1️⃣ Catalogos ferreteria",
        "2️⃣ Catalogos casas",
        "4️⃣ Metodos de pago",
        "5️⃣ Consultar con un *asesor*"
    ],
    {
        capture: true
    },
    (ctx, flow) => {
        if (ctx.body === '1') {
            flow.gotoFlow(flowPDFProductos)
        } else if (ctx.body === '2') {
            flow.gotoFlow(flowPDFCasas)
        } else if (ctx.body === '4') {
            flow.gotoFlow(flowMetodoPagos)
        } else if (ctx.body === '5') {
            flow.gotoFlow(flowAsesor)
        }
    }
)

const flowMetodoPagos = addKeyword('4').addAnswer(
    [
        "Metodos de pagos no disponible por el momento. ☝\n*Elige otras opciones:*",
        "1️⃣ Catalogos ferreteria",
        "2️⃣ Catalogos casas",
        "3️⃣ Catalogos bloquetas",
        "5️⃣ Consultar con un *asesor*"
    ],
    {
        capture: true
    },
    (ctx, flow) => {
        if (ctx.body === '1') {
            flow.gotoFlow(flowPDFProductos)
        } else if (ctx.body === '2') {
            flow.gotoFlow(flowPDFCasas)
        } else if (ctx.body === '3') {
            flow.gotoFlow(flowPDFBloquetas)
        } else if (ctx.body === '5') {
            flow.gotoFlow(flowAsesor)
        }
    }
)

const flowAsesor = addKeyword('5').addAnswer(
    [
        "🙋‍♀️🙋‍♂️",
        "¡Listo! Ahora estás en la fila de atencion, esto puede tardar unos minutos. Un asesor especializado te atendera."
    ]
)

const flowPrincipal = addKeyword(['hola', 'buenas', 'ola', 'consulta', 'hello', 'que tal', 'pregunta'])
    .addAnswer('*¡Hola* 👋*,* *Bienvenido a nuestro canal de atención* *(J&H Mendoza)* Estamos listos para atenderte. Por favor, selecciona la opción 👇')
    .addAnswer(
        [
            '1️⃣ Catalogos ferreteria',
            '2️⃣ Catalogos casas',
            '3️⃣ Catalogos bloquetas',
            '4️⃣ Metodos de pago',
            '5️⃣ Consultar con un *asesor*'
        ],
        null,
        null,
        [flowPDFProductos, flowPDFCasas, flowPDFBloquetas, flowMetodoPagos, flowAsesor]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(WsProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb({
        port: PORT
    })
}

main()
