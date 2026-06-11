function readPackage(pkg, context) {
  if (pkg.dependencies) {
    delete pkg.dependencies['@salla.sa/ui-address-autocomplete-widget'];
    delete pkg.dependencies['@salla.sa/ui-google-map-render'];
  }
  if (pkg.devDependencies) {
    delete pkg.devDependencies['@salla.sa/ui-address-autocomplete-widget'];
    delete pkg.devDependencies['@salla.sa/ui-google-map-render'];
  }
  return pkg;
}
module.exports = { hooks: { readPackage } };
