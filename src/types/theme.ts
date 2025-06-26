export const themeOptions = [
    {   
        name: 'Green', 
        className: 'green',
    },
    {
        name: 'Yellow',
        className: 'yellow',
    },
    {
        name: 'Cyan',
        className: 'cyan',
    },
    {
        name: 'Navy',
        className: 'navy',
    },
    {
        name: 'Red',
        className: 'red',
    },
    {
        name: 'Purple',
        className: 'purple',
    },
    {
        name: 'Light Purple',
        className: 'light-purple',
    },
    {
        name: 'Turquoise',
        className: 'turquoise',
    },
    {
        name: 'Brown',
        className: 'brown',
    },
    {
        name: 'Magenta',
        className: 'magenta',
    },
    {
        name: 'Blue',
        className: 'blue',
    },
    {
        name: 'Navy Grey',
        className: 'navy-grey',
    },
    {
        name: 'Army Green',
        className: 'army-green',
    },
    {
        name: 'Gold',
        className: 'gold',
    },
    {
        name: 'Orange',
        className: 'orange',
    }
] as const;

export type ThemeOption = {
    name: (typeof themeOptions)[number]['name'];
    className: (typeof themeOptions)[number]['className'];
    selected: boolean;
}