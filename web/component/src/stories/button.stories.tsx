import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof Button> = {
    title: "UI/Button",
    component: Button,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
        },
        size: {
            control: "select",
            options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
        },
        disabled: { control: "boolean" },
        asChild: { control: false },
    },
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
    args: {
        children: "Button",
        variant: "default",
        size: "default",
    },
}

export const Outline: Story = {
    args: {
        children: "Outline",
        variant: "outline",
    },
}

export const Secondary: Story = {
    args: {
        children: "Secondary",
        variant: "secondary",
    },
}

export const Ghost: Story = {
    args: {
        children: "Ghost",
        variant: "ghost",
    },
}

export const Destructive: Story = {
    args: {
        children: "Destructive",
        variant: "destructive",
    },
}

export const Link: Story = {
    args: {
        children: "Link",
        variant: "link",
    },
}

export const Disabled: Story = {
    args: {
        children: "Disabled",
        disabled: true,
    },
}

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Button size="xs">XSmall</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
        </div>
    ),
}

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-2">
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
        </div>
    ),
}
