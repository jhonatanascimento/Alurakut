import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import nookies from "nookies";
import jwt from "jsonwebtoken";
import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
  AlurakutProfileSidebarMenuDefault
} from "../src/lib/AlurakutCommons";
import React from "react";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img
        alt="imagem"
        src={`https://github.com/${propriedades.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <p>
        <a
          className="boxLink"
          href={`Https://github.com/${propriedades.githubUser}`}
          style={{ fontSize: ".7em" }}
        >
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>

      <ul>
        {propriedades.items.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`/users/https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home(props) {
  const [comunidades, setComunidades] = React.useState([]);
  const usuarioAleatorio = props.githubUser;
  // const comunidades = reac;
  const pessoasFavoritas = [
    "juunegreiros",
    "omariosouto",
    "peas",
    "rafaballerini",
    "marcobrunodev",
    "felipefialho"
  ];

  //o pegar o array de dados do github

  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function () {
    fetch(`https://api.github.com/users/${props.githubUser}/followers`)
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      });

    //API GraphQL
    fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: "c81cb4f72c5de4807aff7f5cde1a1b",
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query: `query {
        allCommunities {
          id 
          title
          imageUrl
         
        }
      }`
      })
    })
      .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        console.log(comunidadesVindasDoDato);
        setComunidades(comunidadesVindasDoDato);
      });
    // .then(function (response) {
    //   return response.json()
    // })
  });

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title" style={{ textAlign: "center" }}>
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCriaComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);
                console.log("Campo:", dadosDoForm.get("title"));
                console.log("Campo:", dadosDoForm.get("image"));

                const comunidade = {
                  title: dadosDoForm.get("title"),
                  imageUrl: dadosDoForm.get("image")
                };

                fetch("/api/comunidades", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(comunidade)
                }).then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                });

                /*
                       fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado); */

                // const comunidadesAtualizadas = [...comunidades, comunidade];
                // setComunidades(comunidadesAtualizadas);
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma url para usarmos de capa"
                  name="image"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                />
              </div>

              <button>Criar Comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">GIF</h2>
            <img
              style={{ height: "40em" }}
              src="https://media1.tenor.com/images/652d5c4ba6f53c7e2c6b9c48fab16e65/tenor.gif?itemid=22353384"
            />
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  // const { isAuthenticated } = await fetch(
  //   "https://alurakut.vercel.app/api/auth",
  //   {
  //     headers: {
  //       Authorization: token
  //     }
  //   }
  // ).then((resposta) => resposta.json());
  const { githubUser } = jwt.decode(token);

  const isAuthenticated = await fetch(`https://github.com/${githubUser}/`).then(
    async (resposta) => {
      if (resposta.status === 404) {
        return false;
      } else {
        return true;
      }
    }
  );

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  return {
    props: {
      githubUser
    } // will be passed to the page component as props
  };
}
