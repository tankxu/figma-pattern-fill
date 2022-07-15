function main() {
  if (figma.currentPage.selection.length !== 2) {
    figma.closePlugin("⚠️ Please select 2 layers.");
    return;
  }
  figma.showUI(__html__, { width: 360, height: 230 });

  let selection1 = figma.currentPage.selection[0];
  let selection2 = figma.currentPage.selection[1];

  figma.ui.postMessage([selection1.name, selection2.name]);

  figma.ui.onmessage = (msg) => {
    if (msg.type === "selection-order") {
      console.log(msg.order);
      let originLayer, targetLayer;
      if (msg.order) {
        originLayer = selection2;
        targetLayer = selection1;
      } else {
        originLayer = selection1;
        targetLayer = selection2;
      }

      if (targetLayer.type == "GROUP") {
        figma.closePlugin("⚠️ Group layer cannot be set as target.");
        return;
      }

      if (targetLayer.type == "SLICE") {
        figma.closePlugin("⚠️ Slice layer cannot be set as target.");
        return;
      }
      console.log(originLayer);

      originLayer
        .exportAsync({ constraint: { type: "SCALE", value: 2 }, format: "PNG" })
        .then((bytes) => {
          // console.log(bytes);
          const image = figma.createImage(bytes);

          let newPaint = [];
          newPaint = JSON.parse(JSON.stringify(targetLayer.fills));
          newPaint.push({
            imageHash: image.hash,
            scaleMode: "TILE",
            scalingFactor: 0.5,
            type: "IMAGE",
          });
          // console.log(newPaint);
          targetLayer.fills = newPaint;
        })
        .then(() => {
          figma.closePlugin();
        });
    }
  };
}

main();
