echo "Building webpack"
npx webpack --config webpack.config.js 
mkdir output
echo "Copying Files..."
cp -r dist output
cp -r assets output
cp index.html output
cp main.css output
cp require.js output
echo "build complete"