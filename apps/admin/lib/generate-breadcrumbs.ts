// export function generateBreadcrumbs(pathname: string) {
//   //   const segments = pathname.split('/').filter(Boolean); // Split path into segments

//   //   return segments.map((segment, index) => {
//   //     console.log('###### here segments', segments);
//   //     const href = '/' + segments.slice(0, index + 1).join('/');
//   //     return { label: segment.charAt(0).toUpperCase() + segment.slice(1), href };
//   //   });

//   // Split the pathname into segments
//   const segments = pathname.split('/').filter(Boolean);

//   // Replace 'admin' with 'dashboard' at index 0
//   if (segments[0] === 'admin') {
//     segments[0] = 'dashboard';
//   }

//   // If 'dashboard' is at index 1, return only ['dashboard']
//   if (segments[1] === 'dashboard') {
//     return [
//       {
//         label: 'Dashboard',
//         href: '/admin/dashboard'
//       }
//     ];
//   }

//   // Generate breadcrumb objects
//   return segments.map((segment, index) => {
//     const href = '/admin/' + segments.slice(0, index + 1).join('/');
//     return {
//       label: segment.charAt(0).toUpperCase() + segment.slice(1),
//       href
//     };
//   });
// }




export function generateBreadcrumbs(pathname: string) {
  // Split the pathname into segments
  const segments = pathname.split('/').filter(Boolean);

  // If we're on the dashboard page, return empty array
  if (segments.length === 2 && segments[0] === 'admin' && segments[1] === 'dashboard') {
    return [];
  }

  // Initialize breadcrumbs array
  const breadcrumbs = [];

  // Always add Dashboard as the first item
  breadcrumbs.push({
    label: 'Dashboard',
    href: '/admin/dashboard'
  });

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    if (segment === 'admin' || segment === 'dashboard') continue;

    const href = '/admin/' + segments.slice(1, i + 1).join('/');
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href
    });
  }

  return breadcrumbs;
}
