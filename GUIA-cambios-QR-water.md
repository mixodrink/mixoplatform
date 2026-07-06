# Guía: QR de Instagram + fila de Water dividida (MainPage mixo-v4)

Objetivo: en la **pantalla principal** del frontend `mixoplatform` (app mixo-v4), dividir la
fila inferior en dos, igual que la fila del medio (mojito/soda):
- **Water** queda en la mitad **inferior-izquierda** (recuadro más estrecho).
- Un **recuadro amarillo pastel con el QR de Instagram** (`@mixo.drink`) queda en la mitad
  **inferior-derecha**, y se desliza fuera cuando se selecciona cualquier bebida.
- La botella de water se recoloca en la esquina inferior-derecha de su propio recuadro.

Todas las rutas son relativas a `~/mixoplatform/frontend/src`. Es Vite + React + styled-components.
No hace falta reiniciar nada: con HMR se refleja solo; si no, `Ctrl+Shift+R` en el kiosko.

---

## Paso 0 — Recrear la imagen del QR

En la máquina origen está en:
- `~/mixosys/frontend/mixo-v3/src/assets/icons/qr-instagram.png` (original)
- `~/mixoplatform/frontend/src/assets/custom/qr-instagram.png` (copia en uso)

Si la otra máquina tiene el mixosys viejo, basta copiarla:
```bash
cp ~/mixosys/frontend/mixo-v3/src/assets/icons/qr-instagram.png \
   ~/mixoplatform/frontend/src/assets/custom/qr-instagram.png
```

Si NO existe, recréala desde este base64 (PNG 800x800, 957 bytes):
```bash
base64 -d > ~/mixoplatform/frontend/src/assets/custom/qr-instagram.png <<'EOF'
iVBORw0KGgoAAAANSUhEUgAAAyAAAAMgAQMAAADhvpQrAAAABlBMVEUAAAD///7S3q9LAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADXUlEQVR4nO3dQW7bOhRAURYeeOgleClamr00LUVLyNCDIPyB2Mc+WVKd4LdpUZ87MAxV5klnD6SclCJJkiRJkiT9c9Wtxvmfhnjz3rnWKX3qFHfeSjlurfAGgUAgEAgEAlkhZdllXnsI7bz5Y8zLt96R1+UK3yAQCAQCgUAgO0j/6DWQEk6Nse5de0kfPAbVkEPc/AaBQCAQCAQC+euQJoyrPbsyb9u9zGvfQoNAIBAIBAKB/J/hrszUNDs1qH5WWiEQCAQCgUAgn0dylxjuxkBKOHUe606xu3ZMm2o5CAQCgUAgEMgmsu4OOcdrF06x/C1ONe+CQCAQCAQCgfwJ5COd589N8/s+PpZ0aPorgkAgEAgEAvnHkbuh7Drv3OWm5XDXnWOa7w5xaPq6sW0HgUAgEAgEAvmOtDeXQEp8PaCmR9Z6p7pbPzfdP5aFQCAQCAQCeV6kxHx3TdQYzrjaUavLTbW75feDQCAQCAQCgXwN0rskraQ5sgnnpZB7tHMHgUAgEAgEAlkI10S1xjguzbUR77ZF1cf/DQgEAoFAIJDnRWo6NG3OEMIQz6i1XnZOTPtk13r0sBoEAoFAIBDIMyL9xms4NYQSSFk5eWvtmJy6PdxBIBAIBAKBQL4M6dQ1DZG5JkzLi8fV7zprE+T+jAqBQCAQCATy7EjuGvPduESmNN/VGO6OcW56+OgECYFAIBAIBPLUSHtzCaSsTkxzdyemeb5rztvnfrcHBAKBQCAQyJMiNS0/ztfP85UphPUx5i09pnb40HAHgUAgEAgEAvmtSF0dlA5BdeEcP0LftqurCbI8OJaFQCAQCAQCgSy+ITAmqiMlhrvT0qkJOcT7rZ07CAQCgUAgkKdG9hri9mk51vUT01t6Uq2k5SEQCAQCgUAgm0jdakyHma3slBX1aKyDQCAQCAQCgXwZcnflEssP84emEKZY/u7EtNUfVtsKAoFAIBAIBPLjxLR1DWSIKw1pr32y+8mJ6U+/IQCBQCAQCAQC2UDGjdt/IMfVZJcPTXceh4NAIBAIBAKBbCNDXJ9i+RrPq3XhbsRbCRAIBAKBQCCQL0Zya6QJ51i+I32I7BPk64M/uQ6BQCAQCATy1Mi6TaSXd+7a6/6eHQQCgUAgEAhEkiRJkiRJ0if7D6fXh3ZFOpUuAAAAAElFTkSuQmCC
EOF
```

Verifica: `file .../qr-instagram.png` debe decir `PNG image data, 800 x 800`.

---

## Paso 1 — Crear el componente del QR

Crear el archivo **`components/InstagramComponent/InstagramQRComponent.tsx`** con este contenido exacto:

```tsx
import React from "react";
import styled from "styled-components";

import qr from "assets/custom/qr-instagram.png";

interface Props {
  isSlide: boolean;
}

interface WrapperProps {
  slide: boolean;
}

const InstagramQRComponent: React.FC<Props> = ({ isSlide }) => {
  return (
    <SectionWrapper slide={isSlide}>
      <Title>@mixo.drink</Title>
      <SubTitle>Follow us</SubTitle>
      <QrBox>
        <QrImage src={qr} alt="Instagram QR" />
      </QrBox>
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section.withConfig({
  shouldForwardProp: (prop) => !["slide"].includes(prop),
})<WrapperProps>`
  width: 41%;
  height: 20%;
  background-color: #fbeaa0;
  border: 20px solid #fdf3c4;
  border-radius: 3rem;
  position: absolute;
  bottom: 290px;
  right: 40px;
  transform: ${(state) => (state.slide ? "translateX(140%)" : "translateX(0)")};
  transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 3.6rem;
  line-height: 3.6rem;
  margin: 0;
  color: #6b5410;
  position: absolute;
  top: 40px;
  left: 40px;
`;

const SubTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 400;
  margin: 0;
  color: #6b5410;
  position: absolute;
  top: 130px;
  left: 40px;
`;

const QrBox = styled.div`
  position: absolute;
  top: 68%;
  right: 24px;
  transform: translateY(-50%);
  background-color: #fff;
  padding: 18px;
  border-radius: 24px;
`;

const QrImage = styled.img`
  display: block;
  width: 190px;
  height: 190px;
`;

export default InstagramQRComponent;
```

---

## Paso 2 — Montarlo en la MainPage

Archivo **`pages/MainPage.tsx`**.

a) Añadir el import junto a los otros de menú:
```tsx
import InstagramQRComponent from 'components/InstagramComponent/InstagramQRComponent';
```

b) Dentro de `<SectionGlobalWrapper>`, justo **después** de `<WaterMenuComponent ... />`, añadir:
```tsx
<InstagramQRComponent isSlide={Object.values(slide).some(Boolean)} />
```
(`slide` es el estado local ya existente; `Object.values(slide).some(Boolean)` es `true`
cuando hay cualquier opción seleccionada, así el QR se desliza fuera como los demás cards.)

---

## Paso 3 — Estrechar el card de Water (mitad izquierda) y ajustar sus textos

Archivo **`components/MenuOptionComponents/WaterComponent/WaterMenuComponent.tsx`**.

a) En `const SectionWrapper` cambiar el ancho del estado NO seleccionado `89` -> `41`:
```
  width: ${(state) => (state.selected ? 94 : 89)}%;   // ANTES
  width: ${(state) => (state.selected ? 94 : 41)}%;   // DESPUES
```

b) En `const TitleH1` (título "Water"), igualar tamaño al de Soda:
```
  font-size: 11rem;  ->  font-size: 7rem;
  line-height: 10rem;   (se queda igual)
```

c) En `const SubTitleH2` (subtítulo "Super Fresh"), subirlo justo bajo el título:
```
  top: 145px;  ->  top: 130px;
```

---

## Paso 4 — Recolocar/redimensionar la botella de Water

Archivo **`components/GridServiceComponent/WaterItemComponent/WaterItemComponent.tsx`**, en
`const DrinkImage`. Solo se tocan los valores del estado de portada (la última rama de cada
ternario, cuando NO está `animationSlideIn`). Dejar intactos los demás valores (240/370, 395/650, 10/37, 2/29, -100):

```
  width:  ... : 260)}px;   ->  ... : 180)}px;
  height: ... : 395}px;    ->  ... : 273}px;
  bottom: ... : 15)}%;     ->  ... : 9)}%;
  right (rama final):
      : props.animationSlideOut
      ? -100
      : 2}%;               ->      : 48}%;
```

Resultado: botella 180x273 px, en la esquina inferior-derecha del recuadro de Water
(`right: 48%`, `bottom: 9%`).

---

## Paso 5 — Verificación

```bash
cd ~/mixoplatform/frontend
for f in \
  components/InstagramComponent/InstagramQRComponent.tsx \
  components/GridServiceComponent/WaterItemComponent/WaterItemComponent.tsx \
  components/MenuOptionComponents/WaterComponent/WaterMenuComponent.tsx \
  pages/MainPage.tsx ; do
  echo "$f -> HTTP $(curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/src/$f)"
done
curl -s -o /dev/null -w "qr-instagram.png -> HTTP %{http_code}\n" \
  http://localhost:5173/src/assets/custom/qr-instagram.png
```
Todo debe dar `HTTP 200`. Luego `Ctrl+Shift+R` en el kiosko.

---

## Notas / afinado fino

Todos los tamaños/posiciones son "a ojo" para el monitor de la 3.2; en otra pantalla puede que
haya que retocar. Valores clave y qué hace cada uno:

| Qué | Archivo | Propiedad | Valor actual |
|---|---|---|---|
| Color recuadro QR | InstagramQRComponent | `background-color` / `border` | `#fbeaa0` / `#fdf3c4` |
| Tamaño imagen QR | InstagramQRComponent | `QrImage width/height` | `190px` |
| Posición imagen QR | InstagramQRComponent | `QrBox top/right` | `68%` / `24px` |
| Fuente texto QR | InstagramQRComponent | `Title` / `SubTitle font-size` | `3.6rem` / `1.8rem` |
| Ancho card Water | WaterMenuComponent | `SectionWrapper width` (no selecc.) | `41` |
| Tamaño botella Water | WaterItemComponent | `DrinkImage width/height` (portada) | `180`/`273` px |
| Posición botella Water | WaterItemComponent | `bottom`/`right` (portada) | `9%` / `48%` |

- `right` es distancia desde el borde derecho: **menor valor = más a la derecha**.
- `bottom` menor = más abajo.
- El QR se oculta al seleccionar una bebida mediante `translateX(140%)` (Paso 1).
