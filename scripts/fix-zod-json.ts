import { Project } from "ts-morph";

const project = new Project();
const filePath = "src/generated/zod/index.ts"; // adjust if needed
const sourceFile = project.addSourceFileAtPath(filePath);

sourceFile.getVariableStatements().forEach((stmt) => {
  stmt.getDeclarations().forEach((decl) => {
    const initializer = decl.getInitializer();
    if (initializer && initializer.getText().includes("z.lazy(() =>")) {
      console.log(`⚡ Patching ${decl.getName()}`);
      decl.setInitializer("z.any()");
    }
  });
});

sourceFile.saveSync();
console.log("✅ Patched z.lazy() → z.any() in", filePath);
