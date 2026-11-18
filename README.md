# Proyecto Ingeniería de Software 1 — Moto Repuestos El Centenario, S.A. (v3)

Repositorio de entregas documentales y presentación interactiva 3D (**IV Entrega Final**) para la asignatura Ingeniería de Software 1 (UNI — DACTIC).

## Estructura

- `MotoRepuestosElCentenario_Angel_Noel_Mendell/`: Entregas oficiales I, II, III y IV (incluye `Documento_Final_Unificado_MotoRepuestosElCentenario.pdf` / `.md` y el modelo financiero `03_Modelo_Financiero_mrec.xlsx`).
- `presentations/PROPUESTA_EL_ENSAMBLAJE.md`: Guion creativo y especificaciones por slide (36 slides en 4 Actos) con mapa verificado de páginas PDF.
- `presentations/iv_entrega_ensamblaje/`: Aplicación web 3D interactiva con Three.js, visor PDF y Excel incrustados en una sola página.
- *(Nota: la carpeta local `MREC/` pertenece a su propio repositorio separado y se excluye intencionalmente aquí.)*

## Cómo continuar o ejecutar desde otra computadora

```bash
git clone https://github.com/NE0NOE/proyecto-ing-software-v3.git
cd proyecto-ing-software-v3/presentations/iv_entrega_ensamblaje
npm install
npm run dev      # Desarrollo local
npm run build    # Compilación de producción offline
```
