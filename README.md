# Booksite - Booksantos  
![Frontend](https://img.shields.io/badge/frontend-React_+_Vite-8e44ad?logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/backend-Node.js_+_Express-9b59b6?logo=node.js&logoColor=white)

**Sua Gestão de Reservas de Imóveis Simples e Eficaz**

O Booksite - Booksantos é uma aplicação fullstack voltada para o gerenciamento de reservas de imóveis de temporada. Oferece uma interface moderna e funcionalidades essenciais para operadores internos controlarem reservas com praticidade e eficiência. Essa aplicação foi desenvolvida como um teste técnico para o estágio Full Stack da Booksantos.

---

## 📸 Prévia do Projeto

Demonstração do sistema em funcionamento:  
![Preview do Booksantos](https://raw.githubusercontent.com/nathaliatg/testebooksantos/refs/heads/main/booksantos.gif)

(Se o GIF não carregar, ele estará disponível no repositório)

---

## ⚙️ Funcionalidades

- Visualização de reservas com dados completos
- Filtros por termo, período, cidade e estado
- Cadastro de novas reservas com cálculo automático
- Edição e exclusão de reservas
- Dashboard com métricas de uso e faturamento
- Design responsivo com Tailwind CSS

---

## 🛠️ Tecnologias Utilizadas

### Backend (API RESTful)

- **Node.js**  
- **Express.js**  
- **SQLite3**  
- **CORS**

### Frontend

- **React**  
- **Vite**  
- **CSS**  
- **React Router DOM**

---

## 🧱 Arquitetura

O projeto adota a arquitetura client-server, separando claramente o frontend (React) e o backend (Node.js/Express).

- **Backend**: expõe uma API RESTful que gerencia a lógica de negócio e acesso ao banco de dados (SQLite).
- **Frontend**: consome essa API para exibir dados e interagir com o usuário de forma dinâmica.

### Banco de Dados

Utiliza SQLite por sua leveza e simplicidade. Ideal para desenvolvimento local.  
> Para produção, recomenda-se PostgreSQL ou MySQL.

---
### ✅ Entrega do Desafio Técnico

Este projeto atende a todos os requisitos definidos para o desafio técnico da Booksantos:

- [x] **Banco de dados relacional criado com 3 tabelas principais:**
  - `apartments`  
  - `contacts`
  - `reservations`

- [x] **Backend funcional com as rotas:**
  - **[GET]** Listar reservas (com dados do apartamento e do contato)  
  - **[POST]** Criar nova reserva  
  - **[GET]** Buscar reservas por intervalo de datas e cidade  
  - **[GET]** Total de reservas e faturamento por canal no último mês  

- [x] **Frontend com as telas solicitadas:**
  - Lista de Reservas (com filtro por cidade e período)  
  - Formulário para adicionar nova reserva  
  - Dashboard com métricas básicas
    
---
## 🗂 Organização de Código

### Backend

```
backend/
├── src/
│   ├── routes/
│   ├── utils/
│   └── app.js
└── database.sqlite
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── main.jsx
```

---

## ▶️ Como Rodar Localmente

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm

### Clone o repositório

```bash
git clone https://github.com/nathaliatg/testebooksantos.git
cd testebooksantos
```

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env  # Verifique se contém PORT=3001
npm start
```

> O banco de dados `database.sqlite` será criado na primeira execução.

### 2. Frontend

Em um novo terminal:

```bash
cd frontend
npm install
cp .env.example .env  # Deve conter: VITE_API_BASE_URL=http://localhost:3001/api
npm run dev
```

> Acesse `http://localhost:5173` para visualizar a aplicação.

---

## 🤝 Contribuindo

1. Faça um fork do projeto  
2. Crie uma branch: `git checkout -b feature/minha-feature`  
3. Commit suas alterações: `git commit -m 'feat: nova funcionalidade'`  
4. Push para o repositório remoto: `git push origin feature/minha-feature`  
5. Abra um Pull Request para revisão

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

Desenvolvido por [Nathalia Gonçalves](https://github.com/nathaliatg)
