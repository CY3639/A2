# MedProfile - Frontend Client

A React-based web application for managing patient medication profiles. It connects to a REST API backend to support user authentication, patient management, medication records, and medication profile assignment.

---

## Purpose

MedProfile provides a graphical interface that allows healthcare users to:

- Register and log in to a secure account
- Browse and search patient records
- View, create, and update medication entries
- Assign and manage medication profiles per patient

The client is intentionally decoupled from the server. It communicates exclusively via HTTP requests to the REST API, treating the backend as a black box and consuming only JSON responses.

---

## How to Contribute

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes, following the existing code style and component structure.
4. Commit your changes with a clear, descriptive message:
   ```bash
   git commit -m "Add pagination to Patients page"
   ```
5. Push your branch to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request against the `main` branch for review.

Please ensure your changes do not break existing functionality, and document any new components or environment variables you introduce.

---

## Dependencies

Dependencies are listed in `package.json`. Install them by running:

```bash
cd client
npm install
```

### Runtime Dependencies

| Package | Purpose |
|---|---|
| `react` | Core UI library for building component-based interfaces |
| `react-dom` | Renders React components into the browser DOM |
| `react-router-dom` | Client-side routing and navigation between pages |
| `@mantine/core` | Primary UI component library (buttons, forms, layout, modals) |
| `@mantine/hooks` | Utility hooks for DOM interactions, debouncing, and state |
| `@mantine/form` | Form state management and inline validation |
| `@mantine/dates` | Date picker components used in patient and medication forms |
| `@tabler/icons-react` | Icon set used throughout the UI |
| `cors` | Handles cross-origin resource sharing for API requests |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `vite` | Development server and production build tool |
| `@vitejs/plugin-react` | Vite plugin for React JSX and fast refresh |
| `eslint` | Static analysis to enforce code quality |
| `eslint-plugin-react-hooks` | Linting rules for correct React Hook usage |
| `eslint-plugin-react-refresh` | Ensures components are safe for Vite's hot module replacement |
| `postcss` | CSS post-processing pipeline |
| `postcss-preset-mantine` | PostCSS configuration required by Mantine v7+ |
| `postcss-simple-vars` | Allows CSS variable usage in PostCSS files |

### Environment Configuration

Create a `.env` file in the `client/` directory before running the app:

```
VITE_API_BASE_URL=https://<your-machine>.ifn666.com/assessment02/api
```

Replace `<your-machine>` with your actual subdomain. Components access this value via:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## Application Architecture

The client follows a **component-based architecture** using React. The entry point is `src/main.jsx`, which mounts the React application into the `#root` DOM element defined in `index.html`.

`src/App.jsx` is the root component. It wraps the entire app in a `MantineProvider` (for theming) and a `BrowserRouter` (for routing). All pages are nested under a shared `Layout` route, so every page automatically inherits the navigation shell.

### Routing

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page |
| `/login` | `Login` | User login form |
| `/register` | `Register` | New user registration form |
| `/registered` | `RegisterPending` | Post-registration confirmation |
| `/admin` | `AdminApproval` | Admin user approval interface |
| `/patients` | `Patients` | Paginated, searchable patient list |
| `/patients/:id` | `PatientDetail` | Individual patient detail view |
| `/medications` | `Medications` | Medication records list |
| `/patients/:id/profiles` | `MedicationProfiles` | Medication profiles for a patient |
| `*` | `NoPage` | 404 fallback |

### Folder Structure

```
client/
├── node_modules
├── public/
│   └── favicon.svg
├── src/
│   ├── components/ # Reusable bespoke components (specific to this domain)
│   │   ├── MedicationForm.jsx
│   │   ├── MedicationItem.jsx
│   │   ├── MedicationProfileForm.jsx
│   │   ├── PatientCard.jsx
│   │   ├── PatientForm.jsx
│   │   ├── ProfileEntry.jsx
│   ├── pages/ # Full-page components, one per route
│   │   ├── AdminApproval.jsx
│   │   ├── Home.jsx
│   │   ├── Layout.jsx # Shared navigation shell using Mantine AppShell
│   │   ├── Login.jsx
│   │   ├── MedicationProfiles.jsx
│   │   ├── Medications.jsx
│   │   ├── NoPage.jsx
│   │   ├── PatientDetail.jsx
│   │   ├── Patients.jsx
│   │   ├── Register.jsx
│   │   └── RegPending.jsx
│   ├── App.css
│   ├── App.jsx # Root component: MantineProvider + BrowserRouter + Routes
│   ├── index.css
│   └── main.jsx # DOM entry point
├── .env # Local environment variables (not committed to version control)
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js                  
```

### Key Design Decisions

- **Pages vs Components:** Files in `src/pages/` map directly to a URL route. Files in `src/components/` are reusable UI pieces used across multiple pages.
- **Authentication:** JWT tokens are stored in `localStorage`. The `Layout` component reads this token on load to determine authenticated state and conditionally renders Login/Logout navigation links.
- **API calls:** All data fetching is done with the native `fetch()` API, using the `VITE_API_BASE_URL` environment variable as the base URL.
- **Mantine UI:** Mantine's Style Props are used for layout and spacing in preference to external CSS. `@mantine/form` handles form state and validation. `@mantine/hooks` is used in place of custom React primitives where a Mantine equivalent exists.

---

## How to Report Issues

1. Check the [Issues](../../issues) page on Github to see if the problem has already been reported.
2. If not, open a new issue and include:
   - A clear description of the problem.
   - Steps to reproduce it.
   - Expected behaviour versus actual behaviour.
   - Relevant error messages, console output, or screenshots.
3. Label the issue appropriately (e.g., `bug`, `enhancement`, `question`).

Issues will be reviewed and responded to as soon as practicable.