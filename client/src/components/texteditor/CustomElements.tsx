/* eslint-disable @typescript-eslint/no-explicit-any */
import '../../assets/list.css';

export const CodeElement = (props: any) => {

    const style = {
        textAlign: props.element.align || 'left', 
    }

    return (
      <pre {...props.attributes} style={style}>
        <code>{props.children}</code>
      </pre>
    )
}

export const ParagraphElement = (props: any) => {
    const style = {
        textAlign: props.element.align || 'left', 
    }

    return (
        <p 
            {...props.attributes}
            style={style}
        >
            {props.children}
        </p>
    ) 
}

export const BulletElement = (props: any) => {
    const style = {
        textAlign: props.element.align || 'left', 
    }

    return (
        <ul 
            {...props.attributes} 
            className="list-disc ml-5"
            style={style}
        >
           {props.children}

        </ul>
    ) 
}

export const NumberedElement = (props: any) => {

    const style = {
        textAlign: props.element.align || 'left', 
    }

    return (
            <ol
                {...props.attributes} 
                className="list-decimal ml-5"
                style={style}
            >
                {props.children}
            </ol>
        
    ) 
}

export const Leaf = (props: any) => {

    const leaf = props.leaf;

    const style: React.CSSProperties = {
      fontFamily: leaf.fontFamily || undefined,
      fontSize: leaf.fontSize || undefined,
      fontWeight: leaf.bold ? 'bold' : 'normal',
      textDecoration: leaf.underline ? 'underline' : 'none',
      fontStyle: leaf.italic ? 'italic' : 'normal',
      color: leaf.color || 'black',
    };
    

    return (
        <span 

            {...props.attributes}
            style={style}
        >
            {props.children}
        </span>
    ) 
}

