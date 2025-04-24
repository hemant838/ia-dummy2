export function generateBreadcrumbs(pathname: string) {
  //   const segments = pathname.split('/').filter(Boolean); // Split path into segments

  //   return segments.map((segment, index) => {
  //     console.log('###### here segments', segments);
  //     const href = '/' + segments.slice(0, index + 1).join('/');
  //     return { label: segment.charAt(0).toUpperCase() + segment.slice(1), href };
  //   });

  // Split the pathname into segments
  const segments = pathname.split('/').filter(Boolean);

  // Replace 'admin' with 'dashboard' at index 0
  if (segments[0] === 'admin') {
    segments[0] = 'dashboard';
  }

  // If 'dashboard' is at index 1, return only ['dashboard']
  if (segments[1] === 'dashboard') {
    return [
      {
        label: 'Dashboard',
        href: '/admin/dashboard'
      }
    ];
  }

  // Generate breadcrumb objects
  return segments.map((segment, index) => {
    const href = '/admin/' + segments.slice(0, index + 1).join('/');
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href
    };
  });
}
