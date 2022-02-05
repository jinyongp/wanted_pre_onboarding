export default function useKeyboardControl(keyControls) {
  const onKeyPress = (event) => {
    Object.entries(keyControls).forEach(([keyType, func]) => {
      if (event.key === keyType) func(event);
    });
  };

  return { onKeyPress };
}
