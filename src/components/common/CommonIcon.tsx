interface IconProps {
    className: string
}
const CommonIcon = ({className}: IconProps) => {
    return (
        <span className={className}></span>
    )
}
export default CommonIcon;