import { config, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

// This is important for SSR (Server Side Rendering)
config.autoAddCss = false;

// Add all icons to the library so you can use them without importing them individually
library.add(fas, fab);
