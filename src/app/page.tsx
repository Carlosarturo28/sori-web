import Hero from '@/components/Hero';

export default function Home() {
  return (
    // Usamos un fragmento <> para envolver los componentes
    // Los estilos de fondo y padding ahora están dentro de Hero y Footer
    <>
      <Hero />

      {/*
        Aquí podrías añadir otras secciones de tu landing si las necesitas,
        como "Características", "Testimonios", "FAQ", etc., como componentes separados.

        Ejemplo:
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-bold text-center mb-8">Características</h2>
            {/* Contenido de características }
          </div>
        </section>
      */}
    </>
  );
}
