# w.one

**w.one** is a lightweight program management web application designed for users to upload, download, and manage program files seamlessly. Built on modern web technologies, it offers a fast, responsive interface and powerful backend support for handling file operations and offline storage.

## Features

- **File Upload & Download**: Securely upload and download program files using a robust server-side API.
- **Archive Management**: Create ZIP archives of multiple files on-the-fly with Archiver and JSZip.
- **Offline Storage**: Utilize PouchDB for client-side data persistence and offline access.
- **User Identification**: FingerprintJS integration to uniquely identify users without traditional authentication.
- **Markdown Rendering**: Convert and display Markdown content using Showdown.
- **Program Listing**: Browse, search, and manage your uploaded programs via a clean SvelteKit UI.

## Tech Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/) · [Vite](https://vitejs.dev/) · [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: Node.js · Adapter-Auto (Express) · [Multer](https://github.com/expressjs/multer) for uploads
- **Data & Storage**:
  - [Archiver](https://www.npmjs.com/package/archiver) & [JSZip](https://www.npmjs.com/package/jszip) for zipping
  - [PouchDB](https://pouchdb.com/) & [pouchdb-adapter-node-websql](https://www.npmjs.com/package/pouchdb-adapter-node-websql) for offline persistence
  - [Showdown](https://github.com/showdownjs/showdown) for Markdown-to-HTML
  - [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs) for user fingerprinting
- **Utilities**: UUID, Compromise for NLP tasks

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm (v6+) or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/New-reZn/w.one.git
   cd w.one
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```
Open your browser at `http://localhost:5173/` to view the app.

### Build for Production

```bash
npm run build
# or
yarn build
```
Preview the production build locally:
```bash
npm run preview
```

## Configuration

- **Uploads directory**: By default, uploaded files are stored in `/static/uploads`. Ensure this folder exists and is writable.
- **Environment Variables**: Create a `.env` file in the project root to override defaults (e.g., custom PouchDB path).

## Project Structure

```
w.one/
├── src/                  # Svelte components, routes, and endpoints
│   ├── routes/           # Application pages and API endpoints
│   └── lib/              # Shared utilities and stores
├── static/               # Static assets (including uploads)
├── w.one-post/           # Markdown posts or blog content
├── .eslintrc.cjs         # ESLint configuration
├── .prettierrc           # Prettier configuration
├── tailwind.config.cjs   # Tailwind CSS settings
├── svelte.config.js      # SvelteKit configuration
├── vite.config.ts        # Vite build configuration
├── package.json          # Project metadata & scripts ([raw.githubusercontent.com](https://raw.githubusercontent.com/New-reZn/w.one/main/package.json))
└── tsconfig.json         # TypeScript compiler options
```

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b my-feature`)
3. Commit your changes (`git commit -m "feat: add new feature"`)
4. Push to the branch (`git push origin my-feature`)
5. Open a Pull Request

Please adhere to the existing code style and include meaningful commit messages.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

