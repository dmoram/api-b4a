# Definimos la imagen de base
FROM node:latest

# Creamos un directorio de trabajo
WORKDIR /app

# Copiamos los archivos .json al directorio de trabajo
COPY package*.json ./

# Instalamos las dependencias y typescript para generar el js
RUN npm ci && npm install typescript -g

# Copiamos el resto de archivos
COPY . .

# Obtener el código en javascript
RUN npm run build

EXPOSE 8000

# Ejecutamos el inicio de la aplicación
CMD ["npm","start"]
