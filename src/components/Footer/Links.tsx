import React from 'react';

interface Props {
  links: { name: string, url: string }[]
}

export default function Links({ links }: Props) {
  const baseUrl = 'https://datacite.org'

  return (
    <ul>
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.url.startsWith('/') ? baseUrl + link.url : link.url}
            target="_blank"
            rel="noreferrer"
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  )
}

