// src/index.ts
var inject = ["systemPrompt", "tools"];
function apply(ctx) {
  ctx.systemPrompt.section({
    name: "pcb-resource-map-auto-preview",
    order: ctx.systemPrompt.getSectionOrder("TOOL_WRITE"),
    text: ({ scope }) => ctx.tools.get("present", scope) === void 0 ? "" : "After successfully generating or updating a .resmap file using a shell, script, or MCP tool, call present with the final existing file path so its PCB Resource Map preview can open automatically. Do not present files merely read or mentioned, and do not present failed or incomplete output. Built-in write/edit operations already trigger the Resource Map preview."
  });
}
export {
  apply,
  inject
};
