const path = require('path');
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const WsProvider  = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

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

const flowImage = addKeyword('1').addAnswer('Este mensaje envia una imagen', {
    media: 'https://trabajosenatipruebas.store/archivos/catalogo.pdf',
}).addAnswer("Te envie el catalogo de ferreteria en PDF ☝")

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
        [flowImage]
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
        name: "J&H Group Bot",
        port: "3005"
    })
}

main()
