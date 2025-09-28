This folder contains source files for the diagrams referenced in `../ARCHITECTURE.MD`.

Filenames and purpose
- system-context.mmd / system-context.puml — Overall system context showing Client, API, DB, Cloudinary, PayPal.
- component-interaction.mmd / component-interaction.puml — How frontend components map to API calls and server controllers.
- data-model.mmd / data-model.puml — ER diagram linking Users, Products, Orders, Cart, Review, Address.
- api-map.mmd / api-map.puml — REST endpoint map grouped by admin and shop.
- auth-sequence.mmd / auth-sequence.puml — Sequence diagram for register/login flow and cookie/token exchange.
- checkout-sequence.mmd / checkout-sequence.puml — Checkout sequence involving PayPal redirect and order finalization.
- admin-upload-flow.mmd / admin-upload-flow.puml — Admin product image upload flow to Cloudinary.
- deployment.mmd / deployment.puml — Deployment topology showing frontend hosting, backend, DB, CDN, and CI/CD.

How to preview and regenerate

Using VS Code extensions
- Mermaid: Install "Markdown Preview Mermaid Support" or "vscode-mermaid-preview" and open `.mmd` files or embed Mermaid inside markdown and use the preview.
- PlantUML: Install "PlantUML" extension and ensure Java is installed; open `.puml` and use preview to render diagrams.

Convert between formats
- Mermaid -> PNG/SVG: Use the Mermaid CLI (npm install -g @mermaid-js/mermaid-cli) then run `mmdc -i input.mmd -o output.svg`.
- PlantUML -> PNG/SVG: Use PlantUML extension or PlantUML jar: `java -jar plantuml.jar input.puml`.

Tips
- Replace placeholder labels and IDs to match your exact models if you change schema.
- Commit generated SVGs to `docs/diagrams/` and update `ARCHITECTURE.MD` to embed them.

Below are the source files included in this folder. Render them with the tools above.
