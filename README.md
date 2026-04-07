# GravityFi App - Personal Finance Tracker

La aplicación de finanzas personales, separada en un Monorepo que incluye un Backend sólido en Django REST Framework y un Frontend ultra minimalista en Next.js con Tailwind CSS v4.

## 🚀 Requisitos Previos Instalados
Asegúrate de que la PC/Laptop desde la que vayas a trabajar cuente con este software:

- **Git** (Para control de versiones).
- **Node.js** (Versión `v20.x` o superior recomendada para compilar las funciones de Next.js v15). Descargable desde *nodejs.org*.
- **Python** (Versión `v3.10` o superior). Chequea tener seleccionada la casilla "Add Python to PATH" al instalarlo en Windows.

---

## 🛠️ Configuración Inicial (Setup 1 vez por computadora)

**1. Descargar Repositorio**
```bash
git clone https://github.com/JoanRomero00/gravityfi-app.git
cd gravityfi-app
```

**2. Desplegar Frontend (Interfaz)**
Abre tu Terminal y ejecuta:
```bash
cd frontend
npm install   
npm run dev   
```
El servidor web encenderá limpiamente en `http://localhost:3000`.


**3. Desplegar Backend (API y Base de Datos)**
Abre una SEGUNDA terminal y colócate en la raíz del proyecto para luego acceder al Backend:
```bash
cd backend

# Aislar el entorno local de Python usando Windows PowerShell:
python -m venv venv
.\venv\Scripts\Activate.ps1  

# En Mac/Linux se usaría: source venv/bin/activate

# Descargar requerimientos (Django, SimpleJWT, CORS, etc.)
pip install -r requirements.txt

# Construir Base de Datos local usando SQLite
python manage.py migrate

# Registrar en la Base de Datos tu usuario administrador
python manage.py createsuperuser
# (Completa interactivo: "admin", email "email@", contraseña)

# Arrancar Sistema
python manage.py runserver
```
La API quedará encendida para el Frontend en `http://localhost:8000`.

---

## 📅 Hábito Diario (El ciclo de avance normal)

**Para empezar tu jornada:**
1. Ábrelo y actualiza todo: `git pull origin main`.
2. Terminal A: `cd frontend` → `npm run dev`.
3. Terminal B: `cd backend` → `.\venv\Scripts\Activate.ps1` → `python manage.py runserver`.

**Al cerrar el día, guarda en la nube para otra máquina:**
```bash
git add .
git commit -m "Añadí mi avance aquí"
git push
```
