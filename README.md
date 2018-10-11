# Clase 5

Creando un buscador.

##### Carpetas

- web: Sitio desarrollado con NextJS - Node - React
- inyector: Modulo JS para inyectar la data al sistemas

Estamos utilizando la data de master de discogz para esta tarea.

##### Primer Paso

Levantar ELS, crear un mapping vacio para music
`
PUT music
`

En la carpeta inyector instalar las dependencias del modulo.
`
npm install 
` o  `yarn install`
Descargar el archivo [data.json](https://mega.nz/#!qfQwFaQB) a la carpeta.
Una ves instaladas las dependencias correr
`node index.js`

Instalar las dependencias del sitio web con `
npm install 
` o  `yarn install` y luego correr
`NODE_ENV=development PORT=3000 node index`

Con esto deberiamos tener la base del buscador. 
Como el mapping es incorrecto debemos ir a acomodandolo a las necesidas de la api con la API de Reindex

```
PUT music
DELETE music 
DELETE /music_3/_alias/music
GET music/_search
GET music/_mapping
GET music/_search 
{
  "size": 0,
  "aggs": {
    "quality": {
      "terms": {"field":"data_quality.keyword"}
    }
  }
}
PUT music_1
{
  "mappings": {
    "doc": {
      "properties": {
        "name": {
          "type":    "text",
          "copy_to": "searchable" 
        },
        "title": {
          "type":    "text",
          "copy_to": "searchable" 
        },
        "styles": {
          "type":    "text",
          "copy_to": "searchable" 
        },
        "searchable": {
          "type":    "text"
        }
      }
    }
  }
}
POST _reindex
{
  "source": {
    "index": "music"
  },
  "dest": {
    "index": "music_1"
  }
}
DELETE music
POST /_aliases
{
    "actions" : [
        { "add" : { "index" : "music_1", "alias" : "music" } }
        
    ]
}
PUT music_2
{ "settings": {
    "analysis": {
      "analyzer": {
        "folding": {
          "tokenizer": "standard",
          "filter":  [ "lowercase", "asciifolding" ]
        }
      }
    }
  },
  "mappings": {
    "doc": {
      "properties": {
        "name": {
          "type":    "text",
          "copy_to": "searchable" 
        },
        "title": {
          "type":    "text",
          "copy_to": "searchable" 
        },
        "styles": {
          "type":    "text",
          "copy_to": "searchable" 
        },
        "searchable": {
          "type":    "text",
          "analyzer" : "folding"
        }
      }
    }
  }
}
POST _reindex
{
  "source": {
    "index": "music_1"
  },
  "dest": {
    "index": "music_2"
  }
}
DELETE music_1
POST /_aliases
{
    "actions" : [
        { "remove" : { "index" : "music_1", "alias" : "music" } },
        { "add" : { "index" : "music_2", "alias" : "music" } }
        
    ]
}
PUT music_3
{ "settings": {
    "analysis": {
      "analyzer": {
        "folding": {
          "tokenizer": "standard",
          "filter":  [ "lowercase", "asciifolding" ]
        }
      }
    }
  },
  "mappings": {
    "doc": {
      "properties": {
        "name": {
          "type":    "text",
          "copy_to": "searchable" 
        },
        "title": {
          "type":    "text",
          "copy_to": "searchable" 
        },
        "styles": {
          "type":    "text",
          "copy_to": "searchable" 
        },
        "searchable": {
          "type":    "text",
          "analyzer" : "folding"
        },
        "year": {
          "type": "text",
          "fields": {
            "as_date": {
              "type": "date",
              "format": "YYYY"
            },
            "as_int": {
              "type": "integer"
            }
            
          }
        }
      }
    }
  }
}
POST _reindex
{
  "source": {
    "index": "music_2"
  },
  "dest": {
    "index": "music_3"
  }
}
```
