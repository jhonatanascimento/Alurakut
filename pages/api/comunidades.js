import { SiteClient } from "datocms-client";

export default async function recebedorDeRequest(request, response) {
  if (request.method === "POST") {
    const TOKEN = "25acc58ddfa2a1d9108af1cb630c2b";
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "977018",
      ...request.body //id que vem do dato
      // title: "Comunidade de teste",
      // imageUrl: "https://picsum.photos/200/300"
    });

    console.log(registroCriado);

    response.json({
      dados: "Algum dado qualquer",
      registroCriado: registroCriado
    });
    return;
  }

  response.status(404).json({
    message: "Ainda não temos nada no GET, mas no Post tem!"
  });
}
