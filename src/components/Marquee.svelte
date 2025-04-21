<script>
const { margin, class: _class, speed = "1", reverse = true, wrapperStyle, children } = $props();
const trueMargin = margin !== undefined ? margin : "2";
</script>

<div
    class={`marquee3k w-full overflow-clip ${wrapperStyle || "bg-[--accent-muted-dark] b-2 b-solid b-[--accent-bg-light]"}`}
    data-speed={speed}
    style={`margin-top: ${parseInt(trueMargin)*0.25}rem; margin-bottom: ${parseInt(trueMargin)*0.25}rem`}
    {...(reverse && {"data-reverse": true})}
>
    <h1 class={_class || "text-[--accent-text-dark] text-7xl lg:text-4xl py-2 px-4 font-bold m-0"}>
        {@render children?.()}
    </h1>
</div>