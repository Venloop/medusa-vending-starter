import { cva, type VariantProps } from "cva"
import { Slot } from "radix-ui"
import * as React from "react"

import { clx } from "@medusajs/ui"
import { Spinner } from "@medusajs/icons"

const buttonVariants = cva({
  base: clx(
    "font-jost",
    "transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden rounded-lg outline-none",
    "disabled:bg-ui-bg-disabled disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:shadow-buttons-neutral disabled:after:hidden",
    "after:transition-fg after:absolute after:inset-0 after:content-['']"
  ),
  variants: {
    variant: {
      primary: clx(
        "text-ui-primary bg-ui-primary",
        "hover:bg-ui-button-primary-hover hover:after:button-primary-hover-gradient",
        "active:bg-ui-button-primary-pressed active:after:button-primary-pressed-gradient",
        "focus-visible:!shadow-buttons-primary-focus"
      ),
      secondary: clx(
        "text-ui-secondary bg-ui-secondary",
        "hover:bg-ui-button-secondary-hover hover:after:button-secondary-hover-gradient",
        "active:bg-ui-button-secondary-pressed active:after:button-secondary-pressed-gradient",
        "focus-visible:!shadow-buttons-secondary-focus"
      ),
      outline: clx(
        "text-ui-outline bg-ui-outline",
        "hover:bg-ui-button-outline-hover hover:after:button-outline-hover-gradient",
        "active:bg-ui-button-outline-pressed active:after:button-outline-pressed-gradient",
        "focus-visible:!shadow-buttons-outline-focus"
      )
    },
    size: {
      small: "text-sm leading-none gap-x-2 px-2 py-1.5",
      base: "text-base leading-none gap-x-2 px-5 py-1.5 h-12",
      large: "text-base leading-none gap-x-2 px-4 py-2.5",
      xlarge: "text-base leading-none gap-x-2 px-5 py-3.5",
    },
  },
  defaultVariants: {
    size: "base",
    variant: "primary",
  },
})

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

/**
 * This component is based on the `button` element and supports all of its props
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      /**
       * The button's style.
       */
      variant = "primary",
      /**
       * The button's size.
       */
      size = "base",
      className,
      /**
       * Whether to remove the wrapper `button` element and use the
       * passed child element instead.
       */
      asChild = false,
      children,
      /**
       * Whether to show a loading spinner.
       */
      isLoading = false,
      disabled,
      ...props
    }: ButtonProps,
    ref
  ) => {
    const Component = asChild ? Slot.Root : "button"

    /**
     * In the case of a button where asChild is true, and isLoading is true, we ensure that
     * only on element is passed as a child to the Slot component. This is because the Slot
     * component only accepts a single child.
     */
    const renderInner = () => {
      if (isLoading) {
        return (
          <span className="pointer-events-none">
            <div
              className={clx(
                "bg-ui-bg-disabled absolute inset-0 flex items-center justify-center rounded-md"
              )}
            >
              <Spinner className="animate-spin" />
            </div>
            {children}
          </span>
        )
      }

      return children
    }

    return (
      <Component
        ref={ref}
        {...props}
        className={clx(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
      >
        {renderInner()}
      </Component>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
