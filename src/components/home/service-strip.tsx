import { services } from "@/lib/sample-data";

export function ServiceStrip() {
  return (
    <section className="container-page section-sm">
      <ul className="grid border-t sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <li
            key={service.title}
            className="stack border-b py-8 [--stack-gap:0.625rem] sm:px-6 sm:odd:border-r lg:border-r lg:last:border-r-0"
          >
            <h2 className="text-label">{service.title}</h2>
            <p className="text-meta text-muted">{service.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
