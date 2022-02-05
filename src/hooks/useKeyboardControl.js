export default function useKeyboardControl(keyControls) {
  const onKeyDown = (event) => {
    if (event.keyCode === 229) return;
    Object.entries(keyControls).forEach(([keyType, func]) => {
      if (event.key === keyType) func(event);
    });
  };

  return { onKeyDown };
}
