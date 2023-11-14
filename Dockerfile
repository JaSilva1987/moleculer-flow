FROM node

WORKDIR /usr/app

COPY package.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 9146

CMD ["npm", "run", "dev"]
