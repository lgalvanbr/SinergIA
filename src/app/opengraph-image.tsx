import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const shieldBuffer = readFileSync(join(process.cwd(), "public/brand/uniandes-shield.png"));
  const shieldSrc = `data:image/png;base64,${shieldBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#ffffff",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 30,
            fontWeight: 700,
            color: "#000000",
            marginBottom: 28,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shieldSrc} width={44} height={44} alt="" style={{ borderRadius: 8 }} />
          <span>Laboratorio SinergIA</span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: 56,
            fontWeight: 700,
            color: "#000000",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 860,
          }}
        >
          <span style={{ marginRight: 16 }}>Inteligencia artificial para</span>
          <span style={{ color: "#7a6100" }}>ciudades sostenibles</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#6e6e73",
            marginTop: 28,
            textAlign: "center",
          }}
        >
          Departamento de Ingeniería Civil y Ambiental · Universidad de los Andes
        </div>
      </div>
    ),
    { ...size }
  );
}
